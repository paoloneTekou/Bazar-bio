class CreateOrderItems < ActiveRecord::Migration[7.1]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: { on_delete: :cascade }
      t.references :product, null: false, foreign_key: true
      t.decimal :quantity, precision: 10, scale: 2, null: false
      t.decimal :unit_price, precision: 12, scale: 2, null: false
      t.decimal :total_price, precision: 12, scale: 2, null: false

      t.timestamps
    end
    add_index :order_items, [:order_id, :product_id], unique: true
  end
end
