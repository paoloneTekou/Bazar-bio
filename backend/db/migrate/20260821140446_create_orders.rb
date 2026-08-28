class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.string :order_reference, null: false
      t.references :customer, foreign_key: { on_delete: :nullify }
      t.references :coupon, foreign_key: { on_delete: :nullify }
      t.string :customer_name, null: false
      t.string :customer_phone, null: false
      t.string :customer_email
      t.references :delivery_zone, null: false, foreign_key: true
      t.text :delivery_address_details, null: false
      t.references :payment_method, null: false, foreign_key: true
      t.references :order_status, null: false, foreign_key: true
      t.string :payment_status, default: 'pending', null: false
      t.decimal :subtotal, precision: 12, scale: 2, null: false
      t.decimal :discount_amount, precision: 12, scale: 2, default: 0.0, null: false
      t.decimal :delivery_fee, precision: 12, scale: 2, null: false
      t.decimal :total_amount, precision: 12, scale: 2, null: false
      t.text :customer_notes

      t.timestamps
    end
    add_index :orders, :order_reference, unique: true
  end
end
