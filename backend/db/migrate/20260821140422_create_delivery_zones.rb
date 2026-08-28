class CreateDeliveryZones < ActiveRecord::Migration[7.1]
  def change
    create_table :delivery_zones do |t|
      t.references :city, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :delivery_fee, precision: 12, scale: 2, default: 1000.0, null: false
      t.boolean :is_active, default: true, null: false

      t.timestamps
    end
    add_index :delivery_zones, [:city_id, :name], unique: true
  end
end
