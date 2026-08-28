class Product < ApplicationRecord
  belongs_to :category
  belongs_to :unit
  belongs_to :season
  belongs_to :origin_city
  belongs_to :artisan
end
