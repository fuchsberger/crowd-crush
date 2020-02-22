defmodule CrowdCrushWeb.LayoutView do
  use CrowdCrushWeb, :view

  def debug, do: Application.get_env(:crowd_crush, :environment) === :dev

  defp dismiss_button, do:
    content_tag :button,
      content_tag(:span, raw("&times;"), aria_hidden: "true"),
      type: "button",
      class: "close",
      data_dismiss: "alert",
      aria_label: "Close"

  def flash_alert(conn, type) do
    case get_flash(conn, type) do
      nil ->
        nil

      msg ->
        type = if type == :error, do: "danger", else: Atom.to_string(type)

        content_tag :div, [msg, dismiss_button()],
          class: "alert alert-#{type} alert-dismissible fade show",
          role: "alert"
    end
  end

  def youtube_api_key, do: Application.get_env(:crowd_crush, :youtube_api_key)

  def parse_flash(conn), do: raw Jason.encode!(get_flash(conn))

  def redirect(conn), do: raw Jason.encode!(Map.get(conn.assigns, :redirect, false))

  def view_name(view_module, view_template) do
    view = Phoenix.Naming.resource_name(view_module, "View")
    [action, "html"] =  String.split(view_template, ".")
    "#{view}/#{action}"
  end
end
