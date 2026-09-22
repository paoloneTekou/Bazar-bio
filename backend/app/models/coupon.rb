class Coupon < ApplicationRecord
  has_many :orders, dependent: :nullify

  validates :code, presence: true, uniqueness: { case_sensitive: false }
  validates :discount_type, inclusion: { in: %w[percent fixed] }
  validates :discount_value, numericality: { greater_than: 0 }

  scope :active, -> { where(is_active: true) }

  def valid_for?(subtotal_amount)
    return false unless is_active?
    return false if starts_at.present? && starts_at > Time.current
    return false if expires_at.present? && expires_at < Time.current
    return false if subtotal_amount.to_f < min_order_amount.to_f

    true
  end

  def calculate_discount(subtotal_amount)
    subtotal = subtotal_amount.to_f
    return 0.0 unless valid_for?(subtotal)

    discount = if discount_type == "percent"
                 (subtotal * discount_value.to_f / 100.0)
               else
                 discount_value.to_f
               end

    discount = [discount, max_discount.to_f].min if max_discount.present? && max_discount.to_f > 0
    [discount, subtotal].min.round(2)
  end
end

