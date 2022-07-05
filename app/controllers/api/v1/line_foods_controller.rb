# frozen_string_literal: true

module Api
  module V1
    class LineFoodsController < ApplicationController
      before_action :set_food, only: %i[create replace]

      def index
        line_foods = LineFood.active
        if line_foods.exists?
          render json: {
            line_food_ids: line_foods.map(&:id),
            restaurant: line_foods[0].restaurant,
            count: line_foods.sum { |line_food| line_food[:count] },
            amount: line_foods.sum(&:total_amount)
          }, status: :ok
        else
          render json: {}, status: :no_content
        end
      end

      def create
        # 他のレストランで注文受付をしている場合は弾く。。。でもウーバーとか別にこれOKだよな
        if LineFood.active.at_other_restaurant(@ordered_food.restaurant_id).exists?
          return render json: {
            exsiting_restaurant_name: LineFood.active.at_other_restaurant(@ordered_food.restaurant_id)
                                              .first.restaurant.name,
            new_restaurant: @ordered_food.restaurant.name
          }, status: :not_acceptable
        end
        set_line_food(@ordered_food)

        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :ok
        else
          render json: {}, status: :internal_server_error
        end
      end

      def replace
        LineFood.active.at_other_restaurant(@ordered_food.restaurant_id).each do |line_food|
          line_food.update_attribute(active: false)
        end
        set_line_food(@ordered_food)
        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end

      private

      def set_food
        @ordered_food = Food.find(params[:food_id])
      end

      def set_line_food(ordered_food)
        @line_food = if ordered_food.line_food.present?
                       ordered_food.line_food.attributes(
                         count: ordered_food.line_food.count += params[:count],
                         is_active: true
                       )
                     else
                       ordered_food.line_food.build(
                         count: params[:count],
                         is_active: true
                       )
                     end
      end
    end
  end
end
