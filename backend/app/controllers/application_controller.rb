class ApplicationController < ActionController::API
  before_action :set_cors_headers

  def options
    set_cors_headers
    head :ok
  end

  private

  def set_cors_headers
    response.headers['Access-Control-Allow-Origin'] = ENV.fetch('FRONTEND_URL') { '*' }
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  end
end
