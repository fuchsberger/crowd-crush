defmodule CrowdCrushWeb.VideoView do
  use CrowdCrushWeb, :view

  def render("video.json", %{video: v}) do
    %{
      id: v.id,
      agents: get_agents(v.markers),
      duration: v.duration,
      title: v.title,
      youtubeID: v.youtubeID,
      aspectratio: v.aspectratio,
      m0_x: v.m0_x,
      m0_y: v.m0_y,
      mX_x: v.mX_x,
      mX_y: v.mX_y,
      mY_x: v.mY_x,
      mY_y: v.mY_y,
      mR_x: v.mR_x,
      mR_y: v.mR_y,
      dist_x: v.dist_x,
      dist_y: v.dist_y,
      overlays: v.overlays
    }
  end

  defp get_agents(markers) do
    Enum.group_by(
      markers,
      fn {agent, _t, _x, _y} -> Integer.to_string(agent) |> String.to_atom() end,
      fn {_agent, time, x, y} -> [time, x, y] end
    )
  end
end
