defmodule CrowdCrushWeb.PublicChannel do
  use CrowdCrushWeb, :channel

  alias CrowdCrushWeb.VideoView

  def join("public", params, socket) do
    last_seen = NaiveDateTime.from_iso8601!(params["last_seen"])
    videos = Simulation.list_videos(last_seen)

    {:ok, %{
      last_seen: now(),
      videos: View.render_many(videos, VideoView, "video.json")
    }, socket}
  end
end
