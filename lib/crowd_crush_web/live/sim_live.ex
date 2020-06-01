defmodule CrowdCrushWeb.SimLive do
  use Phoenix.LiveView, container: {:div, class: "sim-container"}

  alias CrowdCrush.Simulation
  alias CrowdCrushWeb.Router.Helpers, as: Routes

  def render(assigns), do: CrowdCrushWeb.SimView.render("index.html", assigns)

  def mount(%{"id" => youtubeID}, session, socket) do
    Process.send_after(self(), :update, 16)

    case Simulation.get_video_by_youtube_id(youtubeID) do
      nil ->
        {:ok, socket
        |> put_flash(:error, "Error 404: The given video link was invalid.")
        |> push_redirect(to: Routes.live_path(socket, CrowdCrushWeb.VideoLive))}

      video ->
        {:ok, socket
        |> assign(:playing, false)
        |> assign(:i, 0)
        |> assign(:user_id, Map.get(session, "user_id"))
        |> assign(:video, video)}
    end
  end

  def handle_event("playing", _params, socket) do
    {:noreply, assign(socket, :playing, true)}
  end

  def handle_event("pausing", _params, socket) do
    {:noreply, assign(socket, :playing, false)}
  end

  def handle_info(:update, %{assigns: %{i: i}} = socket) do
    Process.send_after(self(), :update, 16)
    {:noreply, assign(socket, :i, i + 0.05)}
  end
end
