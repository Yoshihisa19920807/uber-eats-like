# frozen_string_literal: true

module Api
  module V1
    class RestaurantsController < ApplicationController
      def index
        restaurants = Restaurant.all
        render json: {
          restaurants:
        }, status: :ok
      end
    end
  end
end
