defmodule CrowdCrushWeb.Router do

  use CrowdCrushWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug CrowdCrushWeb.Auth
    plug :put_root_layout, {CrowdCrushWeb.LayoutView, :root}
  end

  pipeline :react do
    plug :put_layout, {LayoutView, "react.html"}
  end

  scope "/", CrowdCrushWeb do
    pipe_through :browser

    get "/export/csv/:id", ExportController, :export_csv
    get "/export/eclipse/:id", ExportController, :export_eclipse
    get "/about", PageController, :about

    live "/test/agents", AgentsLive
    live "/test/canvas", CanvasLive

    live "/videos", VideoLive
    resources "/sessions", SessionController, only: [:new, :create, :delete]
  end

  scope "/", CrowdCrushWeb do
    pipe_through [:browser, :authenticate_user]

  end

  scope "/", CrowdCrushWeb do
    pipe_through [:browser, :react]

    get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
