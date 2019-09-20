defmodule CrowdCrushWeb.LayoutView do
  use CrowdCrushWeb, :view

  def debug, do: Application.get_env(:crowd_crush, :env) === :dev

  def youtube_api_key, do: Application.get_env(:crowd_crush, :youtube_api_key)

  def get_flash(conn), do: raw Jason.encode!(Phoenix.Controller.get_flash(conn))

  def redirect(conn), do: raw Jason.encode!(Map.get(conn.assigns, :redirect, false))

  def unique_view_name(view_module, view_template) do
    [action, "html"] = String.split(view_template, ".")

    view_module
    |> Phoenix.Naming.resource_name()
    |> String.replace("_view", "/#{action}")
  end
end
