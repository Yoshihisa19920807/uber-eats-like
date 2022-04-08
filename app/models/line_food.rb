class LineFood < ApplicationRecord
  belongs_to :food
  belongs_to :order, optional: true

  validates :count, presence: true

  scope :active, -> { where(is_active: true) }
  scope :picked_restaurant, -> (picked_restaurant_id) { where.not(restaurant_id: picked_restaurant_id) }

  def total_amount
    food.price * count
  end
end