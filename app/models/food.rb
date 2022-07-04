# frozen_string_literal: true

class Food < ApplicationRecord
  belongs_to :restaurant
  has_one :line_food

  validates :name, :price, :description, presence: true
  validates :name, length: { maximum: 30 }
  validates :price, numericality: { greater_than: 0 }
end
