class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions do |t|
      t.references :order, null: false, foreign_key: { on_delete: :cascade }
      t.references :payment_method, null: false, foreign_key: true
      t.string :transaction_reference
      t.decimal :amount, precision: 12, scale: 2, null: false
      t.string :status, default: 'pending', null: false
      t.json :raw_provider_response

      t.timestamps
    end
    add_index :transactions, :transaction_reference
  end
end
