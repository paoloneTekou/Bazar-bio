class Order < ApplicationRecord
  belongs_to :customer
  belongs_to :coupon
  belongs_to :delivery_zone
  belongs_to :payment_method
  belongs_to :order_status
end
