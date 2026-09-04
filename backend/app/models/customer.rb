class Customer < ApplicationRecord
  has_secure_password

  belongs_to :default_delivery_zone, class_name: 'DeliveryZone', optional: true
  has_many :orders, dependent: :nullify

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :phone, presence: true

  before_save :track_whatsapp_opt_in

  scope :whatsapp_subscribers, -> { where(whatsapp_opt_in: true).where.not(phone: [nil, '']) }

  private

  def track_whatsapp_opt_in
    if whatsapp_opt_in_changed? && whatsapp_opt_in?
      self.whatsapp_opt_in_at = Time.current
    end
  end
end

