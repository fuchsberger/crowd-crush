defmodule CrowdCrushWeb.Router do

  use CrowdCrushWeb, :router

  import Phoenix.LiveView.Router

  alias CrowdCrushWeb.LayoutView

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug CrowdCrushWeb.Auth
  end

  pipeline :react do
    plug :put_layout, {LayoutView, "react.html"}
  end

  scope "/", CrowdCrushWeb do
    pipe_through :browser # Use the default browser stack
    get "/export/csv/:id", ExportController, :export_csv
    get "/export/eclipse/:id", ExportController, :export_eclipse

    get "/test", PageController, :test

    get "/about", PageController, :about

    resources "/sessions", SessionController, only: [:new, :create, :delete]
    resources "/videos", VideoController, only: [:index]
  end

  scope "/", CrowdCrushWeb do
    pipe_through [:browser, :authenticate_user]

    live "/video", VideoLive
  end

  scope "/", CrowdCrushWeb do
    pipe_through [:browser, :react]

    get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
