class CreateCountries < ActiveRecord::Migration[7.1]
  def change
    create_table :countries do |t|
      t.references :currency, null: false, foreign_key: true
      t.string :name, null: false
      t.string :code, null: false
      t.string :phone_code, null: false

      t.timestamps
    end
    add_index :countries, :name, unique: true
    add_index :countries, :code, unique: true
  end
end
