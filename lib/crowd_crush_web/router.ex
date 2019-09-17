defmodule CrowdCrushWeb.Router do
  use CrowdCrushWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_layout, false
    plug CrowdCrushWeb.Auth
  end

  scope "/", CrowdCrushWeb do
    pipe_through :browser # Use the default browser stack
    get "/export/csv/:id", ExportController, :export_csv
    get "/export/eclipse/:id", ExportController, :export_eclipse

    post "/login", SessionController, :create
    get "/logout", SessionController, :delete

    get "/test", PageController, :test
    get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
