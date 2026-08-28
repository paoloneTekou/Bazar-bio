class CreateOrderStatuses < ActiveRecord::Migration[7.1]
  def change
    create_table :order_statuses do |t|
      t.string :name, null: false
      t.string :code, null: false

      t.timestamps
    end
    add_index :order_statuses, :name, unique: true
    add_index :order_statuses, :code, unique: true
  end
end
