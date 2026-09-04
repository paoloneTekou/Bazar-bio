class Product < ApplicationRecord
  belongs_to :category
  belongs_to :unit
  belongs_to :season
  belongs_to :origin_city, class_name: 'City', foreign_key: 'origin_city_id', optional: true
  belongs_to :artisan, optional: true
  has_many :product_images, dependent: :destroy
  has_many :order_items, dependent: :restrict_with_error

  scope :active, -> { where(is_active: true) }
  scope :in_stock, -> { where('stock_quantity > 0') }
  scope :featured_drops, -> { active.where(is_featured_drop: true) }
  scope :pending_broadcast, -> {
    active.in_stock.where('last_broadcasted_at IS NULL OR updated_at > last_broadcasted_at OR is_featured_drop = true')
  }
end

