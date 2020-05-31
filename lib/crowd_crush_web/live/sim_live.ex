defmodule CrowdCrushWeb.SimLive do
  use Phoenix.LiveView, container: {:div, class: "sim-container"}

  alias CrowdCrush.Simulation
  alias CrowdCrushWeb.Router.Helpers, as: Routes

  def render(assigns), do: CrowdCrushWeb.SimView.render("index.html", assigns)

  def mount(%{"id" => youtubeID}, session, socket) do
    case Simulation.get_video_by_youtube_id(youtubeID) do
      nil ->
        {:ok, socket
        |> put_flash(:error, "Error 404: The given video link was invalid.")
        |> push_redirect(to: Routes.live_path(socket, CrowdCrushWeb.VideoLive))}

      video ->
        {:ok, socket
        |> assign(:user_id, Map.get(session, "user_id"))
        |> assign(:video, video)}
    end
  end
end
