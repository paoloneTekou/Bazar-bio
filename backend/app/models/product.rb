class Product < ApplicationRecord
  belongs_to :category
  belongs_to :unit
  belongs_to :season
  belongs_to :origin_city, class_name: 'City', foreign_key: 'origin_city_id', optional: true
  belongs_to :artisan, optional: true
  has_many :product_images, dependent: :destroy
  has_many :order_items, dependent: :restrict_with_error
end

