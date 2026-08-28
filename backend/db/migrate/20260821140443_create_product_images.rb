class CreateProductImages < ActiveRecord::Migration[7.1]
  def change
    create_table :product_images do |t|
      t.references :product, null: false, foreign_key: { on_delete: :cascade }
      t.string :image_url, null: false
      t.integer :position, default: 0, null: false

      t.timestamps
    end
    add_index :product_images, [:product_id, :position]
  end
end
