class Artisan < ApplicationRecord
  belongs_to :city
  belongs_to :user, optional: true
  has_many :products, dependent: :nullify

  validates :name, presence: true
  validates :bio, presence: true
end

