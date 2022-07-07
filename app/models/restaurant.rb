# frozen_string_literal: true

class Restaurant < ApplicationRecord
  has_many :foods, dependent: :destroy
  has_many :line_foods, through: :foods

  validates :name, :fee, :delivery_time, presence: true
  validates :name, length: { maximum: 30 }
  validates :fee, numericality: { greater_than: 0 }
end
