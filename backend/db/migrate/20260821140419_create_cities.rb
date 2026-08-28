class CreateCities < ActiveRecord::Migration[7.1]
  def change
    create_table :cities do |t|
      t.references :region, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end
    add_index :cities, [:region_id, :name], unique: true
  end
end
