class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.references :category, null: false, foreign_key: true
      t.references :unit, null: false, foreign_key: true
      t.references :season, null: false, foreign_key: true
      t.references :origin_city, null: false, foreign_key: { to_table: :cities }
      t.references :artisan, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 12, scale: 2, null: false
      t.string :product_type, null: false
      t.integer :stock_quantity, default: 0, null: false
      t.json :specifications
      t.string :image_url
      t.boolean :is_active, default: true, null: false

      t.timestamps
    end
    add_index :products, :is_active
  end
end
