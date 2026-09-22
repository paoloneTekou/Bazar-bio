class AddDeliveryTimeSlotToOrders < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :delivery_time_slot, :string, default: "morning", null: false
    add_index :orders, :delivery_time_slot
  end
end
