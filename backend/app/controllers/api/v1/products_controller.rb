module Api
  module V1
    class ProductsController < ApplicationController
      # GET /api/v1/products
      def index
        @products = Product.where(is_active: true)

        if params[:category_slug].present?
          category = Category.find_by(slug: params[:category_slug])
          @products = @products.where(category: category) if category
        elsif params[:category_id].present?
          @products = @products.where(category_id: params[:category_id])
        end

        if params[:type].present?
          @products = @products.where(product_type: params[:type])
        end

        if params[:season_code].present?
          season = Season.find_by(code: params[:season_code])
          @products = @products.where(season: season) if season
        end

        render json: @products.as_json(
          include: {
            category: { only: [:id, :name, :slug] },
            unit: { only: [:id, :name, :abbreviation] },
            season: { only: [:id, :name, :code] },
            artisan: { only: [:id, :name, :bio, :profile_image_url] }
          }
        )
      end

      # GET /api/v1/products/:id
      def show
        @product = Product.find_by(id: params[:id], is_active: true)

        if @product
          render json: @product.as_json(
            include: {
              category: { only: [:id, :name, :slug] },
              unit: { only: [:id, :name, :abbreviation] },
              season: { only: [:id, :name, :code] },
              artisan: { only: [:id, :name, :bio, :profile_image_url] },
              product_images: { only: [:id, :image_url, :position] }
            }
          )
        else
          render json: { error: "Product not found" }, status: :not_found
        end
      end
    end
  end
end
