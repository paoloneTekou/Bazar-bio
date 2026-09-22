require "test_helper"

module Api
  module V1
    class ApiEndpointsTest < ActionDispatch::IntegrationTest
      setup do
        # Seed test database if empty
        if Category.count == 0
          Rails.application.load_seed
        end

        @product = Product.first
        @zone = DeliveryZone.where("delivery_fee > 0").first || DeliveryZone.first
        @payment = PaymentMethod.first
      end

      test "GET /api/v1/products returns JSON list of active products" do
        get api_v1_products_url
        assert_response :success

        json = JSON.parse(response.body)
        assert json.is_a?(Array)
        assert json.length > 0
        assert_not_nil json.first["name"]
        assert_not_nil json.first["price"]
        assert_not_nil json.first["category"]
      end

      test "GET /api/v1/categories returns list of categories" do
        get api_v1_categories_url
        assert_response :success

        json = JSON.parse(response.body)
        assert json.is_a?(Array)
        assert json.length > 0
      end

      test "GET /api/v1/delivery_zones returns active neighborhoods with fees" do
        get api_v1_delivery_zones_url
        assert_response :success

        json = JSON.parse(response.body)
        assert json.is_a?(Array)
        assert json.length > 0
        assert json.first.key?("delivery_fee")
      end

      test "POST /api/v1/orders calculates prices on server and generates whatsapp link" do
        post api_v1_orders_url, params: {
          order: {
            customer_name: "Jean Dupont",
            customer_phone: "+237690123456",
            delivery_zone_id: @zone.id,
            delivery_address_details: "Maison jaune près du carrefour",
            payment_method_id: @payment.id,
            customer_notes: "Livraison avant 14h"
          },
          items: [
            { product_id: @product.id, quantity: 2 }
          ]
        }, as: :json

        assert_response :created

        json = JSON.parse(response.body)
        assert_equal "Commande enregistrée avec succès", json["message"]
        assert_not_nil json["order_reference"]
        assert_not_nil json["whatsapp_url"]
        assert json["whatsapp_url"].include?("wa.me")
        assert json["whatsapp_url"].include?("Jean+Dupont")

        expected_subtotal = (@product.price * 2).to_f
        expected_total = expected_subtotal + @zone.delivery_fee.to_f

        assert_equal expected_subtotal, json["subtotal"].to_f
        assert_equal expected_total, json["total_amount"].to_f
      end

      test "POST /api/v1/coupons/validate validates active coupons" do
        post api_v1_coupons_validate_url, params: {
          code: "BIENVENUE10",
          subtotal: 5000.0
        }, as: :json

        assert_response :success
        json = JSON.parse(response.body)
        assert json["valid"]
        assert_equal 500.0, json["coupon"]["calculated_discount"].to_f

        # Invalid coupon
        post api_v1_coupons_validate_url, params: {
          code: "INVALID_CODE",
          subtotal: 5000.0
        }, as: :json
        assert_response :not_found
        json = JSON.parse(response.body)
        assert_not json["valid"]

        # Minimum order not met
        post api_v1_coupons_validate_url, params: {
          code: "YAOUNDE1000",
          subtotal: 3500.0
        }, as: :json
        assert_response :unprocessable_entity
        json = JSON.parse(response.body)
        assert_not json["valid"]
      end

      test "POST /api/v1/orders rejects orders below minimum amount" do
        cheap_product = Product.create!(
          name: "Item Bon Marché",
          category: Category.first,
          unit: Unit.first,
          season: Season.first,
          origin_city: City.first,
          price: 500.0,
          product_type: "produce",
          stock_quantity: 10,
          is_active: true
        )

        post api_v1_orders_url, params: {
          order: {
            customer_name: "Test Client",
            customer_phone: "+237690000000",
            delivery_zone_id: @zone.id,
            payment_method_id: @payment.id
          },
          items: [{ product_id: cheap_product.id, quantity: 1 }]
        }, as: :json

        assert_response :unprocessable_entity
        json = JSON.parse(response.body)
        assert json["error"].include?("montant minimum de commande")
      end

      test "POST /api/v1/orders allows orders below 3000 FCFA for store pickup" do
        cheap_product = Product.create!(
          name: "Herbes Aromatiques",
          category: Category.first,
          unit: Unit.first,
          season: Season.first,
          origin_city: City.first,
          price: 800.0,
          product_type: "produce",
          stock_quantity: 15,
          is_active: true
        )

        pickup_zone = DeliveryZone.find_or_create_by!(city: City.first, name: "Point de Retrait - Boutique Bazar-Bio (Bastos)") do |z|
          z.delivery_fee = 0.0
          z.is_active = true
        end

        post api_v1_orders_url, params: {
          order: {
            customer_name: "Client Retrait",
            customer_phone: "+237690112233",
            delivery_zone_id: pickup_zone.id,
            payment_method_id: @payment.id,
            fulfillment_type: "pickup"
          },
          items: [{ product_id: cheap_product.id, quantity: 1 }]
        }, as: :json

        assert_response :created
        json = JSON.parse(response.body)
        assert_equal 800.0, json["subtotal"].to_f
        assert_equal 0.0, json["delivery_fee"].to_f
        assert_equal 800.0, json["total_amount"].to_f
        decoded_url = CGI.unescape(json["whatsapp_url"])
        assert decoded_url.include?("Point de collecte") || decoded_url.include?("Retrait")
      end

      test "POST /api/v1/orders applies coupon and delivery time slot" do
        post api_v1_orders_url, params: {
          order: {
            customer_name: "Jeanne Mballa",
            customer_phone: "+237677112233",
            delivery_zone_id: @zone.id,
            delivery_address_details: "Carrefour Bastos",
            delivery_time_slot: "afternoon",
            coupon_code: "BIENVENUE10",
            payment_method_id: @payment.id
          },
          items: [{ product_id: @product.id, quantity: 3 }]
        }, as: :json

        assert_response :created
        json = JSON.parse(response.body)
        assert_equal "afternoon", json["delivery_time_slot"]
        assert json["discount_amount"].to_f > 0
        decoded_url = CGI.unescape(json["whatsapp_url"])
        assert decoded_url.include?("Après-midi")
        assert decoded_url.include?("BIENVENUE10")
      end

      test "POST /api/v1/orders/:id/cancel cancels order and restores product stock" do
        initial_stock = @product.stock_quantity

        post api_v1_orders_url, params: {
          order: {
            customer_name: "Paul Biya",
            customer_phone: "+237699999999",
            delivery_zone_id: @zone.id,
            payment_method_id: @payment.id
          },
          items: [{ product_id: @product.id, quantity: 2 }]
        }, as: :json

        assert_response :created
        json = JSON.parse(response.body)
        order_ref = json["order_reference"]

        @product.reload
        assert_equal initial_stock - 2, @product.stock_quantity

        # Cancel order
        post cancel_api_v1_order_url(order_ref), as: :json
        assert_response :success

        @product.reload
        assert_equal initial_stock, @product.stock_quantity
      end
    end
  end
end
