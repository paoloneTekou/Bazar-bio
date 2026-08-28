class PaymentWebhook < ApplicationRecord
  belongs_to :payment_method
end
