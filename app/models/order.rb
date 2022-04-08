class Order < ApplicationRecord
  has_many :line_foods

  validates :total_price, numerically: { greater_than: 0 }

  # コントローラでやればいいのでは？
  def save_with_update_line_foods!(line_foods)
    ActiveRecord::Base.transaction do
      line_foods.each do |line_food|
        line_food.update(is_active: false, order: self)
      end
      self.save!
    end
  end
end