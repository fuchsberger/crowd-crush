defmodule CrowdCrushWeb.PublicChannel do
  use CrowdCrushWeb, :channel
  import CrowdCrush.Simulation

  alias CrowdCrushWeb.VideoView

  def join("public", params, socket) do
    last_updated = Map.get(params, :last_updated, ~N[2000-01-01 10:00:00])
    {now, videos} = list_videos(last_updated)

    params = %{
      last_updated: now,
      videos: View.render_many(videos, VideoView, "video.json")
    }
    {:ok, params, socket}
  end
end
