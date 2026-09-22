module Api
  module V1
    class OrdersController < ApplicationController
      class OrderProcessingError < StandardError; end

      MIN_ORDER_AMOUNT = 3000.0

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

        delivery_slot = order_params[:delivery_time_slot].presence || "morning"
        unless %w[morning afternoon].include?(delivery_slot)
          delivery_slot = "morning"
        end

        order = nil
        subtotal = 0.0
        products_to_decrement = []

        ActiveRecord::Base.transaction do
          order = Order.new(
            customer_name: order_params[:customer_name],
            customer_phone: order_params[:customer_phone],
            customer_email: order_params[:customer_email],
            delivery_zone: delivery_zone,
            delivery_address_details: order_params[:delivery_address_details] || "Livraison directe",
            payment_method: payment_method,
            order_status: order_status,
            customer_notes: order_params[:customer_notes],
            delivery_time_slot: delivery_slot,
            whatsapp_opt_in: order_params[:whatsapp_opt_in].nil? ? true : order_params[:whatsapp_opt_in],
            delivery_fee: delivery_zone.delivery_fee,
            subtotal: 0,
            discount_amount: 0,
            total_amount: 0
          )

          # Sort items deterministically by product_id to prevent database deadlocks
          sorted_items = items_params.sort_by { |item| item[:product_id].to_i }

          sorted_items.each do |item_data|
            # Pessimistic Row Locking: product.with_lock / lock("FOR UPDATE")
            product = Product.lock("FOR UPDATE").find_by(id: item_data[:product_id], is_active: true)
            unless product
              raise OrderProcessingError, "Produit non disponible (ID: #{item_data[:product_id]})."
            end

            qty = item_data[:quantity].to_f
            qty = 1.0 if qty <= 0

            # Stock quantity validation
            if product.stock_quantity < qty
              unit_name = product.unit_label
              raise OrderProcessingError, "Stock insuffisant pour #{product.name} (disponible : #{product.stock_quantity} #{unit_name})."
            end

            line_total = product.price * qty
            subtotal += line_total

            order.order_items.build(
              product: product,
              quantity: qty,
              unit_price: product.price,
              total_price: line_total
            )

            products_to_decrement << [product, qty]
          end

          # Minimum order threshold verification (3 000 FCFA)
          if subtotal < MIN_ORDER_AMOUNT
            raise OrderProcessingError, "Le montant minimum de commande est de #{MIN_ORDER_AMOUNT.to_i} FCFA pour assurer la viabilité de la livraison (sous-total actuel : #{subtotal.to_i} FCFA)."
          end

          # Coupon validation and calculation
          coupon_code = params[:coupon_code].presence || order_params[:coupon_code].presence
          if coupon_code.present?
            coupon = Coupon.active.find_by("LOWER(code) = ?", coupon_code.to_s.strip.downcase)
            if coupon.nil?
              raise OrderProcessingError, "Le code promo '#{coupon_code}' est introuvable ou inactif."
            elsif !coupon.valid_for?(subtotal)
              raise OrderProcessingError, "Le code promo '#{coupon.code}' n'est pas applicable (minimum requis : #{coupon.min_order_amount.to_i} FCFA)."
            else
              order.coupon = coupon
              order.discount_amount = coupon.calculate_discount(subtotal)
            end
          else
            order.discount_amount = 0.0
          end

          order.subtotal = subtotal
          order.total_amount = [subtotal - order.discount_amount, 0].max + delivery_zone.delivery_fee

          order.save!

          # Real-time Stock Depletion
          products_to_decrement.each do |product, qty|
            product.decrement!(:stock_quantity, qty)
          end
        end

        whatsapp_text = generate_whatsapp_text(order)
        whatsapp_url = "https://wa.me/237654818121?text=#{CGI.escape(whatsapp_text)}"

        render json: {
          message: "Commande enregistrée avec succès",
          order_reference: order.order_reference,
          subtotal: order.subtotal,
          discount_amount: order.discount_amount,
          delivery_fee: order.delivery_fee,
          total_amount: order.total_amount,
          delivery_time_slot: order.delivery_time_slot,
          whatsapp_url: whatsapp_url,
          order: order.as_json(
            include: {
              delivery_zone: { only: [:id, :name, :delivery_fee] },
              coupon: { only: [:id, :code, :discount_type, :discount_value] },
              order_items: {
                include: { product: { only: [:id, :name, :price] } }
              }
            }
          )
        }, status: :created
      rescue OrderProcessingError => e
        render json: { error: e.message }, status: :unprocessable_entity
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      # GET /api/v1/orders/:id
      def show
        order = Order.find_by(id: params[:id]) || Order.find_by(order_reference: params[:id])

        if order
          render json: order.as_json(
            include: {
              delivery_zone: { only: [:id, :name, :delivery_fee] },
              coupon: { only: [:id, :code, :discount_type, :discount_value] },
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

      # POST /api/v1/orders/:id/cancel
      def cancel
        order = Order.find_by(id: params[:id]) || Order.find_by(order_reference: params[:id])
        unless order
          return render json: { error: "Commande non trouvée" }, status: :not_found
        end

        if order.cancelled?
          return render json: { error: "Cette commande est déjà annulée." }, status: :unprocessable_entity
        end

        if order.cancel!
          render json: {
            message: "Commande #{order.order_reference} annulée avec succès et stock restauré.",
            order_reference: order.order_reference,
            status: "cancelled"
          }
        else
          render json: { error: "Impossible d'annuler la commande." }, status: :unprocessable_entity
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
          :delivery_time_slot,
          :payment_method_id,
          :payment_method_code,
          :customer_notes,
          :coupon_code,
          :whatsapp_opt_in
        )
      end

      def generate_whatsapp_text(order)
        items_summary = order.order_items.map do |item|
          "• #{item.product.name} (x#{item.quantity.to_i == item.quantity ? item.quantity.to_i : item.quantity}) - #{item.total_price.to_i} FCFA"
        end.join("\n")

        slot_label = order.delivery_time_slot == "afternoon" ? "Après-midi (14h00 - 18h00)" : "Matin (08h30 - 12h00)"

        discount_line = if order.discount_amount.to_f > 0
                          "🏷️ *Remise Coupon (#{order.coupon&.code}):* -#{order.discount_amount.to_i} FCFA\n"
                        else
                          ""
                        end

        <<~TEXT.strip
          🌿 *NOUVELLE COMMANDE BAZAR-BIO* 🌿
          -----------------------------------
          📋 *Réf:* #{order.order_reference}
          👤 *Nom:* #{order.customer_name}
          📞 *Tél:* #{order.customer_phone}
          📍 *Quartier:* #{order.delivery_zone.name}
          🏡 *Adresse/Repères:* #{order.delivery_address_details}
          ⏰ *Créneau de livraison:* #{slot_label}

          🛒 *ARTICLES:*
          #{items_summary}

          -----------------------------------
          💵 *Sous-total:* #{order.subtotal.to_i} FCFA
          #{discount_line}🚚 *Livraison:* #{order.delivery_fee.to_i} FCFA
          💰 *TOTAL À PAYER:* #{order.total_amount.to_i} FCFA
          💳 *Mode de paiement:* #{order.payment_method.name}

          Merci pour votre soutien aux producteurs bio locaux ! 🌿
        TEXT
      end
    end
  end
end
