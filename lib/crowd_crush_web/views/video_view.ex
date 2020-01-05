defmodule CrowdCrushWeb.VideoView do
  use CrowdCrushWeb, :view

  def render("video.json", %{video: v}) do
    %{
      id: v.id,
      duration: v.duration,
      title: v.title,
      inserted_at: NaiveDateTime.to_iso8601(v.inserted_at) <> "Z",
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
      markers: v.markers,
      overlays: v.overlays
    }
  end
end
