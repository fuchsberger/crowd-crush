defmodule CrowdCrushWeb.Router do
  use CrowdCrushWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_layout, false
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  # scope "/" do
  #   pipe_through :browser
  #   get "/export/csv/:id", CrowdCrushWeb.ExportController, :export_csv
  #   get "/export/json/:id", CrowdCrushWeb.ExportController, :export_json
  # end

  scope "/", CrowdCrushWeb do
    pipe_through :api
    post "/login", SessionsController, :create
  end

  scope "/", CrowdCrushWeb do
    pipe_through :browser # Use the default browser stack
    get "/export/csv/:id", ExportController, :export_csv
    get "/export/eclipse/:id", ExportController, :export_eclipse
    get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
