class AddWhatsappOptInAndVendorRoles < ActiveRecord::Migration[7.2]
  def change
    # 1. WhatsApp preferences on customers
    add_column :customers, :whatsapp_opt_in, :boolean, default: true, null: false
    add_column :customers, :whatsapp_opt_in_at, :datetime
    add_index :customers, :whatsapp_opt_in

    # 2. WhatsApp preferences on orders (guest visitors)
    add_column :orders, :whatsapp_opt_in, :boolean, default: true, null: false
    add_index :orders, :whatsapp_opt_in

    # 3. Connect artisans/producers to user login accounts (vendor role)
    add_reference :artisans, :user, foreign_key: true, null: true

    # 4. Product drop tracking for 3x weekly WhatsApp digests
    add_column :products, :last_broadcasted_at, :datetime
    add_column :products, :is_featured_drop, :boolean, default: false, null: false
    add_index :products, :is_featured_drop
    add_index :products, :last_broadcasted_at
  end
end
