defmodule CrowdCrushWeb.PageController do
  use CrowdCrushWeb, :controller

  def about(conn, _), do: render conn, "about.html"

  def index(conn, _) do
    if is_nil(conn.assigns.current_user),
      do: redirect(conn, to: Routes.page_path(conn, :about)),
      else: redirect(conn, to: Routes.live_path(conn, CrowdCrushWeb.VideoLive))
  end

  def test(conn, _), do: render conn, "test.html"
end
