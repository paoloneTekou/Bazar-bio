class CreateCurrencies < ActiveRecord::Migration[7.1]
  def change
    create_table :currencies do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.string :symbol, null: false
      t.decimal :exchange_rate, precision: 12, scale: 6, default: 1.0, null: false

      t.timestamps
    end
    add_index :currencies, :name, unique: true
    add_index :currencies, :code, unique: true
  end
end
