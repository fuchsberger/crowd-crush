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

        agents =
          video.markers
          |> Enum.group_by(fn {id, _, _, _} -> id end, fn {_, time, x, y} -> {time, x, y} end)

        {:ok, socket
        |> assign(:agents, agents)
        |> assign(:agent_positions, [])
        |> assign(:playing, false)
        |> assign(:i, 0)
        |> assign(:time, 0)
        |> assign(:user_id, Map.get(session, "user_id"))
        |> assign(:video, video)}
    end
  end

  def handle_event("ping", %{"time" => time}, socket) do

    # convert time into miliseconds
    time = time * 1000

    # get current agent positions
    agent_positions =
      socket.assigns.agents
      |> Enum.into(%{}, fn {id, markers} ->

        # find first marker where it's time is at or after current time
        case Enum.find_index(markers, fn {t, _x, _y} ->  t >= time end) do
          nil ->  # time is after last marker -> show nothing
            {id, nil}

          0 ->    # time is before or at first marker 0 -> show nothing
            {id, nil}

          idx ->  # idx is the marker after, idx-1 the marker before -> approximate
            {t1, x1, y1 } = Enum.at(markers, idx-1)
            {t2, x2, y2 } = Enum.at(markers, idx)

            percentage = (time - t1) / (t2 - t1)
            x = x1 + (x2 - x1) * percentage
            y = y1 + (y2 - y1) * percentage

            {id, [x, y]}
        end
      end)

    {:noreply, assign(socket, :agent_positions, agent_positions)}
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
