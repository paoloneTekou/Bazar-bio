class CreatePaymentMethods < ActiveRecord::Migration[7.1]
  def change
    create_table :payment_methods do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.boolean :is_active, default: true, null: false

      t.timestamps
    end
    add_index :payment_methods, :name, unique: true
    add_index :payment_methods, :code, unique: true
  end
end
