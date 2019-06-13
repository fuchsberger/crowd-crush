defmodule CrowdCrushWeb.PageView do
  use CrowdCrushWeb, :view

  def debug, do: Application.get_env(:crowd_crush, :env) === :dev

  def youtube_api_key, do: Application.get_env(:crowd_crush, :youtube_api_key)

  def get_flash(conn), do: raw Jason.encode!(Phoenix.Controller.get_flash(conn))

  def redirect(conn), do: raw Jason.encode!(Map.get(conn.assigns, :redirect, false))
end
