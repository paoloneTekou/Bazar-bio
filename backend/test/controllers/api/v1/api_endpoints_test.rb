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
        @zone = DeliveryZone.first
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
    end
  end
end
