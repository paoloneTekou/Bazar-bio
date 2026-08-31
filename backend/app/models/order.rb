class Order < ApplicationRecord
  belongs_to :customer, optional: true
  belongs_to :coupon, optional: true
  belongs_to :delivery_zone
  belongs_to :payment_method
  belongs_to :order_status
  has_many :order_items, dependent: :destroy

  before_validation :generate_order_reference, on: :create

  private

  def generate_order_reference
    self.order_reference ||= "BB-#{Time.current.strftime('%Y%m%d')}-#{SecureRandom.hex(3).upcase}"
  end
end

