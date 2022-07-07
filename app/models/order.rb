# frozen_string_literal: true

class Order < ApplicationRecord
  has_many :line_foods

  validates :total_price, numericality: { greater_than: 0 }

  # コントローラでやればいいのでは？
  # 複数箇所で使う場合にこちらの方が都合良さげ
  def save_with_update_line_foods!(line_foods)
    ActiveRecord::Base.transaction do
      line_foods.each do |line_food|
        line_food.update(is_active: false, order: self)
      end
      save!
    end
  end
end
