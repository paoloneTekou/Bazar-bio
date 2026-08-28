class CreateSeasons < ActiveRecord::Migration[7.1]
  def change
    create_table :seasons do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.boolean :is_active, default: true, null: false

      t.timestamps
    end
    add_index :seasons, :name, unique: true
    add_index :seasons, :code, unique: true
  end
end
