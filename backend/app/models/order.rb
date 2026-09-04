class Order < ApplicationRecord
  belongs_to :customer, optional: true
  belongs_to :coupon, optional: true
  belongs_to :delivery_zone
  belongs_to :payment_method
  belongs_to :order_status
  has_many :order_items, dependent: :destroy

  scope :whatsapp_opted_in, -> { where(whatsapp_opt_in: true).where.not(customer_phone: [nil, '']) }
  scope :guest_whatsapp_subscribers, -> { where(customer_id: nil, whatsapp_opt_in: true).where.not(customer_phone: [nil, '']) }

  before_validation :generate_order_reference, on: :create

  private

  def generate_order_reference
    self.order_reference ||= "BB-#{Time.current.strftime('%Y%m%d')}-#{SecureRandom.hex(3).upcase}"
  end
end

