class CreatePaymentWebhooks < ActiveRecord::Migration[7.1]
  def change
    create_table :payment_webhooks do |t|
      t.references :payment_method, null: false, foreign_key: true
      t.string :external_transaction_id
      t.string :request_ip
      t.json :headers
      t.json :payload, null: false
      t.string :status, default: 'unprocessed', null: false
      t.text :error_log

      t.timestamps
    end
    add_index :payment_webhooks, :external_transaction_id
    add_index :payment_webhooks, :status
  end
end
