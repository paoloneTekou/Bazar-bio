# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_09_04_152845) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "artisans", force: :cascade do |t|
    t.bigint "city_id", null: false
    t.string "name", null: false
    t.text "bio", null: false
    t.string "profile_image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["city_id"], name: "index_artisans_on_city_id"
    t.index ["user_id"], name: "index_artisans_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
    t.index ["slug"], name: "index_categories_on_slug", unique: true
  end

  create_table "cities", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["region_id", "name"], name: "index_cities_on_region_id_and_name", unique: true
    t.index ["region_id"], name: "index_cities_on_region_id"
  end

  create_table "countries", force: :cascade do |t|
    t.bigint "currency_id", null: false
    t.string "name", null: false
    t.string "code", null: false
    t.string "phone_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_countries_on_code", unique: true
    t.index ["currency_id"], name: "index_countries_on_currency_id"
    t.index ["name"], name: "index_countries_on_name", unique: true
  end

  create_table "coupons", force: :cascade do |t|
    t.string "code", null: false
    t.string "discount_type", null: false
    t.decimal "discount_value", precision: 12, scale: 2, null: false
    t.decimal "min_order_amount", precision: 12, scale: 2, default: "0.0", null: false
    t.decimal "max_discount", precision: 12, scale: 2
    t.boolean "is_active", default: true, null: false
    t.datetime "starts_at"
    t.datetime "expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_coupons_on_code", unique: true
    t.index ["is_active"], name: "index_coupons_on_is_active"
  end

  create_table "currencies", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.string "symbol", null: false
    t.decimal "exchange_rate", precision: 12, scale: 6, default: "1.0", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_currencies_on_code", unique: true
    t.index ["name"], name: "index_currencies_on_name", unique: true
  end

  create_table "customers", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "phone", null: false
    t.bigint "default_delivery_zone_id"
    t.text "default_delivery_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "whatsapp_opt_in", default: true, null: false
    t.datetime "whatsapp_opt_in_at"
    t.index ["default_delivery_zone_id"], name: "index_customers_on_default_delivery_zone_id"
    t.index ["email"], name: "index_customers_on_email", unique: true
    t.index ["whatsapp_opt_in"], name: "index_customers_on_whatsapp_opt_in"
  end

  create_table "delivery_zones", force: :cascade do |t|
    t.bigint "city_id", null: false
    t.string "name", null: false
    t.decimal "delivery_fee", precision: 12, scale: 2, default: "1000.0", null: false
    t.boolean "is_active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["city_id", "name"], name: "index_delivery_zones_on_city_id_and_name", unique: true
    t.index ["city_id"], name: "index_delivery_zones_on_city_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "product_id", null: false
    t.decimal "quantity", precision: 10, scale: 2, null: false
    t.decimal "unit_price", precision: 12, scale: 2, null: false
    t.decimal "total_price", precision: 12, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id", "product_id"], name: "index_order_items_on_order_id_and_product_id", unique: true
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "order_statuses", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_order_statuses_on_code", unique: true
    t.index ["name"], name: "index_order_statuses_on_name", unique: true
  end

  create_table "orders", force: :cascade do |t|
    t.string "order_reference", null: false
    t.bigint "customer_id"
    t.bigint "coupon_id"
    t.string "customer_name", null: false
    t.string "customer_phone", null: false
    t.string "customer_email"
    t.bigint "delivery_zone_id", null: false
    t.text "delivery_address_details", null: false
    t.bigint "payment_method_id", null: false
    t.bigint "order_status_id", null: false
    t.string "payment_status", default: "pending", null: false
    t.decimal "subtotal", precision: 12, scale: 2, null: false
    t.decimal "discount_amount", precision: 12, scale: 2, default: "0.0", null: false
    t.decimal "delivery_fee", precision: 12, scale: 2, null: false
    t.decimal "total_amount", precision: 12, scale: 2, null: false
    t.text "customer_notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "whatsapp_opt_in", default: true, null: false
    t.index ["coupon_id"], name: "index_orders_on_coupon_id"
    t.index ["customer_id"], name: "index_orders_on_customer_id"
    t.index ["delivery_zone_id"], name: "index_orders_on_delivery_zone_id"
    t.index ["order_reference"], name: "index_orders_on_order_reference", unique: true
    t.index ["order_status_id"], name: "index_orders_on_order_status_id"
    t.index ["payment_method_id"], name: "index_orders_on_payment_method_id"
    t.index ["whatsapp_opt_in"], name: "index_orders_on_whatsapp_opt_in"
  end

  create_table "payment_methods", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.boolean "is_active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_payment_methods_on_code", unique: true
    t.index ["name"], name: "index_payment_methods_on_name", unique: true
  end

  create_table "payment_webhooks", force: :cascade do |t|
    t.bigint "payment_method_id", null: false
    t.string "external_transaction_id"
    t.string "request_ip"
    t.json "headers"
    t.json "payload", null: false
    t.string "status", default: "unprocessed", null: false
    t.text "error_log"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["external_transaction_id"], name: "index_payment_webhooks_on_external_transaction_id"
    t.index ["payment_method_id"], name: "index_payment_webhooks_on_payment_method_id"
    t.index ["status"], name: "index_payment_webhooks_on_status"
  end

  create_table "product_images", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "image_url", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "position"], name: "index_product_images_on_product_id_and_position"
    t.index ["product_id"], name: "index_product_images_on_product_id"
  end

  create_table "products", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.bigint "unit_id", null: false
    t.bigint "season_id", null: false
    t.bigint "origin_city_id", null: false
    t.bigint "artisan_id"
    t.string "name", null: false
    t.text "description"
    t.decimal "price", precision: 12, scale: 2, null: false
    t.string "product_type", null: false
    t.integer "stock_quantity", default: 0, null: false
    t.json "specifications"
    t.string "image_url"
    t.boolean "is_active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_broadcasted_at"
    t.boolean "is_featured_drop", default: false, null: false
    t.index ["artisan_id"], name: "index_products_on_artisan_id"
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["is_active"], name: "index_products_on_is_active"
    t.index ["is_featured_drop"], name: "index_products_on_is_featured_drop"
    t.index ["last_broadcasted_at"], name: "index_products_on_last_broadcasted_at"
    t.index ["origin_city_id"], name: "index_products_on_origin_city_id"
    t.index ["season_id"], name: "index_products_on_season_id"
    t.index ["unit_id"], name: "index_products_on_unit_id"
  end

  create_table "regions", force: :cascade do |t|
    t.bigint "country_id", null: false
    t.string "name", null: false
    t.string "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id", "name"], name: "index_regions_on_country_id_and_name", unique: true
    t.index ["country_id"], name: "index_regions_on_country_id"
  end

  create_table "seasons", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.boolean "is_active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_seasons_on_code", unique: true
    t.index ["name"], name: "index_seasons_on_name", unique: true
  end

  create_table "transactions", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "payment_method_id", null: false
    t.string "transaction_reference"
    t.decimal "amount", precision: 12, scale: 2, null: false
    t.string "status", default: "pending", null: false
    t.json "raw_provider_response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_transactions_on_order_id"
    t.index ["payment_method_id"], name: "index_transactions_on_payment_method_id"
    t.index ["transaction_reference"], name: "index_transactions_on_transaction_reference"
  end

  create_table "units", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbreviation", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbreviation"], name: "index_units_on_abbreviation", unique: true
    t.index ["name"], name: "index_units_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "role", default: "staff", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "artisans", "cities"
  add_foreign_key "artisans", "users"
  add_foreign_key "cities", "regions"
  add_foreign_key "countries", "currencies"
  add_foreign_key "customers", "delivery_zones", column: "default_delivery_zone_id"
  add_foreign_key "delivery_zones", "cities"
  add_foreign_key "order_items", "orders", on_delete: :cascade
  add_foreign_key "order_items", "products"
  add_foreign_key "orders", "coupons", on_delete: :nullify
  add_foreign_key "orders", "customers", on_delete: :nullify
  add_foreign_key "orders", "delivery_zones"
  add_foreign_key "orders", "order_statuses"
  add_foreign_key "orders", "payment_methods"
  add_foreign_key "payment_webhooks", "payment_methods"
  add_foreign_key "product_images", "products", on_delete: :cascade
  add_foreign_key "products", "artisans"
  add_foreign_key "products", "categories"
  add_foreign_key "products", "cities", column: "origin_city_id"
  add_foreign_key "products", "seasons"
  add_foreign_key "products", "units"
  add_foreign_key "regions", "countries"
  add_foreign_key "transactions", "orders", on_delete: :cascade
  add_foreign_key "transactions", "payment_methods"
end
