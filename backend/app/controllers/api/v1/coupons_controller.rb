module Api
  module V1
    class CouponsController < ApplicationController
      # POST /api/v1/coupons/validate
      def validate
        code = params[:code].to_s.strip.downcase
        subtotal = params[:subtotal].to_f

        if code.blank?
          return render json: { valid: false, error: "Veuillez saisir un code promo." }, status: :unprocessable_entity
        end

        coupon = Coupon.active.find_by("LOWER(code) = ?", code)
        unless coupon
          return render json: { valid: false, error: "Code promo '#{params[:code]}' introuvable ou inactif." }, status: :not_found
        end

        unless coupon.valid_for?(subtotal)
          if subtotal < coupon.min_order_amount.to_f
            return render json: {
              valid: false,
              error: "Ce code promo nécessite un sous-total minimum de #{coupon.min_order_amount.to_i} FCFA (actuel : #{subtotal.to_i} FCFA)."
            }, status: :unprocessable_entity
          elsif coupon.expires_at.present? && coupon.expires_at < Time.current
            return render json: { valid: false, error: "Ce code promo a expiré." }, status: :unprocessable_entity
          else
            return render json: { valid: false, error: "Ce code promo n'est pas applicable actuellement." }, status: :unprocessable_entity
          end
        end

        discount = coupon.calculate_discount(subtotal)

        render json: {
          valid: true,
          coupon: {
            id: coupon.id,
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value.to_f,
            calculated_discount: discount,
            min_order_amount: coupon.min_order_amount.to_f,
            max_discount: coupon.max_discount&.to_f
          }
        }, status: :ok
      end
    end
  end
end
