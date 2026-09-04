class User < ApplicationRecord
  has_secure_password

  has_one :artisan, dependent: :nullify

  ROLES = %w[admin vendor staff].freeze

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :role, inclusion: { in: ROLES }

  def admin?
    role == 'admin'
  end

  def vendor?
    role == 'vendor'
  end

  def staff?
    role == 'staff'
  end
end

