module Api
  module V1
    class DeliveryZonesController < ApplicationController
      # GET /api/v1/delivery_zones
      def index
        @delivery_zones = DeliveryZone.where(is_active: true).includes(:city)
        render json: @delivery_zones.as_json(
          only: [:id, :name, :delivery_fee],
          include: { city: { only: [:id, :name] } }
        )
      end
    end
  end
end
