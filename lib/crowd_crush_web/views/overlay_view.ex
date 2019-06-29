defmodule CrowdCrushWeb.OverlayView do
  use CrowdCrushWeb, :view

  def render("overlay.json", %{overlay: o}) do
    %{
      id: o.id,
      title: o.title,
      youtubeID: o.youtubeID
    }
  end
end
