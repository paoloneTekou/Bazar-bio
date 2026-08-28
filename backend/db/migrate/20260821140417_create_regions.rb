class CreateRegions < ActiveRecord::Migration[7.1]
  def change
    create_table :regions do |t|
      t.references :country, null: false, foreign_key: true
      t.string :name, null: false
      t.string :code

      t.timestamps
    end
    add_index :regions, [:country_id, :name], unique: true
  end
end
