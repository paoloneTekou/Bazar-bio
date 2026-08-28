class CreateCustomers < ActiveRecord::Migration[7.1]
  def change
    create_table :customers do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :phone, null: false
      t.references :default_delivery_zone, foreign_key: { to_table: :delivery_zones }
      t.text :default_delivery_address

      t.timestamps
    end
    add_index :customers, :email, unique: true
  end
end
