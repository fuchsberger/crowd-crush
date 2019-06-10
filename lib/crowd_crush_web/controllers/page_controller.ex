defmodule CrowdCrushWeb.PageController do
  use CrowdCrushWeb, :controller

  def index(conn, _), do: render conn, "index.html"
end
