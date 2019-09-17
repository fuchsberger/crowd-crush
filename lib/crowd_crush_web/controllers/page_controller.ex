defmodule CrowdCrushWeb.PageController do
  use CrowdCrushWeb, :controller

  def index(conn, _), do: render conn, "index.html"

  def test(conn, _), do: render conn, "test.html"
end
