class CreateCoupons < ActiveRecord::Migration[7.1]
  def change
    create_table :coupons do |t|
      t.string :code, null: false
      t.string :discount_type, null: false
      t.decimal :discount_value, precision: 12, scale: 2, null: false
      t.decimal :min_order_amount, precision: 12, scale: 2, default: 0.0, null: false
      t.decimal :max_discount, precision: 12, scale: 2
      t.boolean :is_active, default: true, null: false
      t.datetime :starts_at
      t.datetime :expires_at

      t.timestamps
    end
    add_index :coupons, :code, unique: true
    add_index :coupons, :is_active
  end
end
