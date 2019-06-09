defmodule CrowdCrushWeb.VideoView do
  use CrowdCrushWeb, :view

  def render("video.json", %{video: v}) do
    %{
      id: v.id,
      title: v.title,
      inserted_at: NaiveDateTime.to_iso8601(v.inserted_at) <> "Z",
      marker_count: v.marker_count,
      youtubeID: v.youtubeID
    }
  end
end
