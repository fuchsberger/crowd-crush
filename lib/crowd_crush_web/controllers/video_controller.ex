defmodule CrowdCrushWeb.VideoController do
  use CrowdCrushWeb, :controller

  alias CrowdCrush.Simulation

  def index(conn, _) do
    videos = Simulation.list_videos()
    render conn, "index.html", videos: videos
  end

  def new(conn, _) do
    render conn, "new.html"
  end
end
