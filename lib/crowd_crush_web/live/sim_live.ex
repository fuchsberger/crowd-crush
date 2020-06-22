defmodule CrowdCrushWeb.SimLive do
  use Phoenix.LiveView

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

        agents =
          video.markers
          |> Enum.group_by(fn {id, _, _, _} -> id end, fn {_, time, x, y} -> {time, x, y} end)

        {:ok, socket
        |> assign(:agents, agents)
        |> assign(:agent_positions, agent_positions(agents, 0))
        |> assign(:paused, true)
        |> assign(:time, 0)
        |> assign(:user_id, Map.get(session, "user_id"))
        |> assign(:video, video)}
    end
  end

  @doc """
  Receive a timestamp and respond with agent data. Runs when client requests.
  """
  def handle_event("ping", %{"time" => time}, socket) do
    # get current agent positions
    agent_positions = agent_positions(socket.assigns.agents, time * 1000)
    {:noreply, assign(socket, :agent_positions, agent_positions)}
  end

  def handle_event("play", %{"time" => time}, socket) do
    {:noreply, socket
    |> assign(:agent_positions, agent_positions(socket.assigns.agents, time * 1000))
    |> assign(:paused, false)}
  end

  def handle_event("pause", %{"time" => time}, socket) do
    {:noreply, socket
    |> assign(:agent_positions, agent_positions(socket.assigns.agents, time * 1000))
    |> assign(:paused, true)}
  end

  defp agent_positions(agents, time) do
    Enum.into(agents, %{}, fn {id, markers} ->

      # find first marker where it's time is at or after current time
      case Enum.find_index(markers, fn {t, _x, _y} ->  t >= time end) do
        nil ->  # time is after last marker -> show nothing
          {id, nil}

        0 ->    # time is before or at first marker
          {t, x, y} = List.first(markers)
          case t == time do
            true -> {id, [x, y]}
            false -> {id, nil}
          end

        idx ->  # idx is the marker after, idx-1 the marker before -> approximate
          {t1, x1, y1 } = Enum.at(markers, idx-1)
          {t2, x2, y2 } = Enum.at(markers, idx)

          percentage = (time - t1) / (t2 - t1)
          x = x1 + (x2 - x1) * percentage
          y = y1 + (y2 - y1) * percentage

          {id, [x, y]}
      end
    end)
  end
end
