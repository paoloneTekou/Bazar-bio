class Order < ApplicationRecord
  belongs_to :customer, optional: true
  belongs_to :coupon, optional: true
  belongs_to :delivery_zone
  belongs_to :payment_method
  belongs_to :order_status
  has_many :order_items, dependent: :destroy

  validates :delivery_time_slot, inclusion: { in: %w[morning afternoon], message: "doit être soit 'morning' (08h30-12h00) soit 'afternoon' (14h00-18h00)" }

  scope :whatsapp_opted_in, -> { where(whatsapp_opt_in: true).where.not(customer_phone: [nil, '']) }
  scope :guest_whatsapp_subscribers, -> { where(customer_id: nil, whatsapp_opt_in: true).where.not(customer_phone: [nil, '']) }

  before_validation :generate_order_reference, on: :create
  after_update :handle_cancellation_stock_restoration, if: :saved_change_to_order_status_id?

  def cancel!
    return false if cancelled?

    cancelled_status = OrderStatus.find_by(code: "cancelled")
    return false unless cancelled_status

    transaction do
      update!(order_status: cancelled_status)
    end
    true
  end

  def cancelled?
    order_status&.code == "cancelled"
  end

  def restore_stock!
    order_items.includes(:product).each do |item|
      item.product.increment!(:stock_quantity, item.quantity)
    end
  end

  private

  def generate_order_reference
    self.order_reference ||= "BB-#{Time.current.strftime('%Y%m%d')}-#{SecureRandom.hex(3).upcase}"
  end

  def handle_cancellation_stock_restoration
    restore_stock! if cancelled?
  end
end

