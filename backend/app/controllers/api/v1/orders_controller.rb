module Api
  module V1
    class OrdersController < ApplicationController
      # POST /api/v1/orders
      def create
        delivery_zone = DeliveryZone.find_by(id: order_params[:delivery_zone_id], is_active: true)
        unless delivery_zone
          return render json: { error: "Quartier de livraison non valide ou inactif." }, status: :unprocessable_entity
        end

        payment_method = PaymentMethod.find_by(id: order_params[:payment_method_id]) ||
                         PaymentMethod.find_by(code: order_params[:payment_method_code]) ||
                         PaymentMethod.find_by(code: "cash_on_delivery")

        order_status = OrderStatus.find_by(code: "pending")

        items_params = params[:items] || []
        if items_params.empty?
          return render json: { error: "Le panier est vide." }, status: :unprocessable_entity
        end

        order = nil
        subtotal = 0.0

        ActiveRecord::Base.transaction do
          order = Order.new(
            customer_name: order_params[:customer_name],
            customer_phone: order_params[:customer_phone],
            customer_email: order_params[:customer_email],
            delivery_zone: delivery_zone,
            delivery_address_details: order_params[:delivery_address_details] || "Direct delivery",
            payment_method: payment_method,
            order_status: order_status,
            customer_notes: order_params[:customer_notes],
            whatsapp_opt_in: order_params[:whatsapp_opt_in].nil? ? true : order_params[:whatsapp_opt_in],
            delivery_fee: delivery_zone.delivery_fee,
            subtotal: 0,
            total_amount: 0
          )

          items_params.each do |item_data|
            product = Product.find_by(id: item_data[:product_id], is_active: true)
            unless product
              raise ActiveRecord::Rollback, "Produit ID #{item_data[:product_id]} non disponible."
            end

            qty = item_data[:quantity].to_f
            qty = 1.0 if qty <= 0

            line_total = product.price * qty
            subtotal += line_total

            order.order_items.build(
              product: product,
              quantity: qty,
              unit_price: product.price,
              total_price: line_total
            )
          end

          order.subtotal = subtotal
          order.discount_amount = 0.0
          order.total_amount = subtotal + delivery_zone.delivery_fee

          unless order.save
            render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end
        end

        if order&.persisted?
          whatsapp_text = generate_whatsapp_text(order)
          whatsapp_url = "https://wa.me/237654818121?text=#{CGI.escape(whatsapp_text)}"

          render json: {
            message: "Commande enregistrée avec succès",
            order_reference: order.order_reference,
            subtotal: order.subtotal,
            delivery_fee: order.delivery_fee,
            total_amount: order.total_amount,
            whatsapp_url: whatsapp_url,
            order: order.as_json(
              include: {
                delivery_zone: { only: [:id, :name, :delivery_fee] },
                order_items: {
                  include: { product: { only: [:id, :name, :price] } }
                }
              }
            )
          }, status: :created
        end
      rescue ActiveRecord::Rollback => e
        render json: { error: e.message || "Impossible de valider la commande" }, status: :unprocessable_entity
      end

      # GET /api/v1/orders/:id
      def show
        order = Order.find_by(id: params[:id]) || Order.find_by(order_reference: params[:id])

        if order
          render json: order.as_json(
            include: {
              delivery_zone: { only: [:id, :name, :delivery_fee] },
              order_status: { only: [:id, :name, :code] },
              payment_method: { only: [:id, :name, :code] },
              order_items: {
                include: { product: { only: [:id, :name, :price, :type, :image_url] } }
              }
            }
          )
        else
          render json: { error: "Commande non trouvée" }, status: :not_found
        end
      end

      private

      def order_params
        params.require(:order).permit(
          :customer_name,
          :customer_phone,
          :customer_email,
          :delivery_zone_id,
          :delivery_address_details,
          :payment_method_id,
          :payment_method_code,
          :customer_notes,
          :whatsapp_opt_in
        )
      end

      def generate_whatsapp_text(order)
        items_summary = order.order_items.map do |item|
          "• #{item.product.name} (x#{item.quantity.to_i == item.quantity ? item.quantity.to_i : item.quantity}) - #{item.total_price.to_i} FCFA"
        end.join("\n")

        <<~TEXT.strip
          🌿 *NOUVELLE COMMANDE BAZAR-BIO* 🌿
          -----------------------------------
          📋 *Réf:* #{order.order_reference}
          👤 *Nom:* #{order.customer_name}
          📞 *Tél:* #{order.customer_phone}
          📍 *Quartier:* #{order.delivery_zone.name}
          🏡 *Adresse/Indications:* #{order.delivery_address_details}

          🛒 *ARTICLES:*
          #{items_summary}

          -----------------------------------
          💵 *Sous-total:* #{order.subtotal.to_i} FCFA
          🚚 *Livraison:* #{order.delivery_fee.to_i} FCFA
          💰 *TOTAL:* #{order.total_amount.to_i} FCFA
          💳 *Mode de paiement:* #{order.payment_method.name}

          Merci pour votre confiance ! 🌿
        TEXT
      end
    end
  end
end
