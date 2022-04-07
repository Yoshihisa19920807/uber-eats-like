class Restaurant < ApplicationRecord
  has_many :foods
  has_many :line_foods, :through: :foods

  validates :name, :fee, :time_required, presence: true
  validates :name, length: { maximum: 30 }
  validate :fee, numerically: { greater_than: 0 }
end