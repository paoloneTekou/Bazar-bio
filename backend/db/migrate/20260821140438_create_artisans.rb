class CreateArtisans < ActiveRecord::Migration[7.1]
  def change
    create_table :artisans do |t|
      t.references :city, null: false, foreign_key: true
      t.string :name, null: false
      t.text :bio, null: false
      t.string :profile_image_url

      t.timestamps
    end
  end
end
