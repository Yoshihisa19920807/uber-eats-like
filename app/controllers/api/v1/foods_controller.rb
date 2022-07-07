# frozen_string_literal: true

module Api
  module V1
    class FoodsController < ApplicationController
      def index
        restaurant = Restaurant.find(params[:restaurant_id])
        foods = restaurant.foods
        render json: {
          foods:
        }, status: :ok
      end
    end
  end
end
