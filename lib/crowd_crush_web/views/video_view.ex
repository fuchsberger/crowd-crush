defmodule CrowdCrushWeb.VideoView do
  use CrowdCrushWeb, :view

  def render("video.json", %{video: v}) do
    %{
      id: v.id,
      duration: v.duration,
      title: v.title,
      inserted_at: NaiveDateTime.to_iso8601(v.inserted_at) <> "Z",
      marker_count: Map.get(v, :marker_count, 0),
      youtubeID: v.youtubeID
    }
  end
end
