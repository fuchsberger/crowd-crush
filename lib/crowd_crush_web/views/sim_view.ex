defmodule CrowdCrushWeb.SimView do
  use CrowdCrushWeb, :view

  def count_markers(video, selected) do
    agent =
      video.markers
      |> Enum.group_by(fn {id, _, _, _} -> id end, fn {_, t, x, y} -> {t, x, y} end)
      |> Map.get(selected)

    case agent do
      nil -> 0
      agent -> Enum.count(agent)
    end
  end

  def btn(action, disabled \\ false) do
    content_tag :button, icon(action),
      class: "btn btn-sm btn-outline-light",
      disabled: disabled,
      phx_click: "control",
      phx_value_action: action
  end
end
