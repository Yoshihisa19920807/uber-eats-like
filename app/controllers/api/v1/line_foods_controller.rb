class Api::V1::LineFoodsController < ApplicationController
  before_action :set_food, only: %i[create]

  def create
    # 他のレストランで注文受付をしている場合は弾く。。。でもウーバーとか別にこれOKだよな
    if LineFood.active.at_other_restaurant(@ordered_food.restaurant_id).exists?
      return render json: {
        exsiting_restaurant_name: LineFood.active.at_other_restaurant(@ordered_food.restaurant_id).first.restaurant.name
        new_restaurant: @ordered_food.restaurant.name,
      }, status: :not_acceptable

    set_line_food(@ordered_food)

    if @line_food.save
      return render json: {
        line_food: @line_food
      }, status: :ok
    else
      return render json: {}, status: :internal_server_error
    end
  end

  private

  def set_food
    @ordered_food = Food.find(params[:food_id])
  end

  def set_line_food(ordered_food)
    if ordered_food.line_food.present?
      @line_food = ordered_food.line_food.attributes(
        count: ordered_food.line_food.count += params[:count],
        is_active: true
      )
    else
      @line_food = ordered_food.line_food.build(
        count: params[:count],
        is_active: true
      )
    end
  end
end
