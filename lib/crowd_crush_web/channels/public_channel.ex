defmodule CrowdCrushWeb.PublicChannel do
  use CrowdCrushWeb, :channel

  alias CrowdCrushWeb.VideoView

  def join("public", params, socket) do
    videos = Simulation.list_videos()
    |> Phoenix.View.render_many(VideoView, "simple.json")

    {:ok, %{ videos: videos }, socket}
  end
end
