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

  def encode_video(video) do
    video
    |> Map.take([
        :radius, :max_speed, :velocity, :max_neighbors, :neighbor_dist, :time_horizon, :time_horizon_obst, :aspectratio, :youtubeID
      ])
    |> Jason.encode!()
  end

  def btn(action, disabled \\ false) do
    content_tag :button, icon(action),
      class: "btn btn-sm btn-outline-light",
      disabled: disabled,
      phx_click: "control",
      phx_value_action: action
  end

  def btn_toggle(setting, active \\ false, icon \\ nil) do
    content_tag :button, icon(icon || setting),
      class: "btn btn-outline-light btn-sm#{if active, do: " active"}",
      title: "Toggle #{String.capitalize(setting)}",
      phx_click: "toggle",
      phx_value_setting: setting
  end
end
