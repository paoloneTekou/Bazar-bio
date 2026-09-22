Rails.application.routes.draw do
  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # Versioned API routes
  namespace :api do
    namespace :v1 do
      resources :products, only: [:index, :show]
      resources :categories, only: [:index]
      resources :delivery_zones, only: [:index]
      resources :orders, only: [:create, :show] do
        member do
          post :cancel
        end
      end
      post "coupons/validate", to: "coupons#validate"
    end
  end
end
