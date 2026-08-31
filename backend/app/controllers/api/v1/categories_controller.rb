module Api
  module V1
    class CategoriesController < ApplicationController
      # GET /api/v1/categories
      def index
        @categories = Category.all
        render json: @categories.as_json(only: [:id, :name, :slug, :description])
      end
    end
  end
end
