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
        {:ok, socket
        |> assign(:action, "paused")
        |> assign(:selected, nil)
        |> assign(:agent_positions, [])
        |> assign(:duration, 0)
        |> assign(:paused, true)
        |> assign(:time, 0)
        |> assign(:user_id, Map.get(session, "user_id"))
        |> assign(:video, video)}
    end
  end

  def handle_event("set_duration", %{"duration" => duration}, socket) do
    {:noreply, assign(socket, :duration, floor(duration))}
  end

  def handle_event("click", %{"x" => x, "y" => y}, socket) do
    case {socket.assigns.selected, Enum.count(socket.assigns.agent_positions)} do
      {_, 0} ->
        # no markers created yet, do nothing
        {:noreply, socket}

      {nil, _count} ->
        # find closest agent and select it
        agent =
          socket.assigns.agent_positions
          |> Enum.reject(fn {_id, coords} -> is_nil(coords) end)
          |> Enum.sort_by(fn {_agent, [x1, y1]} ->
              :math.sqrt(:math.pow(x1 - x, 2) + :math.pow(y1 - y, 2))
            end)
          |> List.first()

        case agent do
          nil -> {:noreply, socket}
          {id, _coords} -> {:noreply, assign(socket, :selected, id)}
        end

      {id, _count} ->
        # agent was selected, create marker at that time
        case Simulation.set_marker(%{
          agent: id,
          time: socket.assigns.time * 1000,
          video_id: socket.assigns.video.id,
          x: x,
          y: y
        }) do
          {:ok, _marker} ->
            socket = assign(socket, :video, Simulation.get_video_by_youtube_id(socket.assigns.video.youtubeID))

            {:noreply, assign(socket, :agent_positions, agent_positions(socket))}
          {:error, _reason} ->
            {:noreply, socket}
        end
    end
  end

  def handle_event("create", _params, socket) do
    {id, _, _, _} = List.last(socket.assigns.video.markers)
    {:noreply, assign(socket, :selected, id + 1)}
  end

  def handle_event("deselect", _params, socket), do: {:noreply, assign(socket, :selected, nil)}

  @doc """
  Control buttons only set the action.
  """
  def handle_event("control", %{"action" => action}, socket) do
    {:noreply, assign(socket, :action, action)}
  end

  @doc """
  Ping events update agents, time and action.
  """
  def handle_event("ping", %{"action" => action, "time" => time}, socket) do
    {:noreply, socket
    |> assign(:action, (if time > socket.assigns.duration, do: "pause", else: action))
    |> assign(:agent_positions, agent_positions(socket, time))
    |> assign(:time, time)}
  end

  def handle_event("keyup", %{"key" => key}, socket) do
    cond do
      key == "a" && socket.assigns.time > 0 ->
        {:noreply, assign(socket, :action, "backward")}

      key == "d" && socket.assigns.time < socket.assigns.duration ->
        {:noreply, assign(socket, :action, "forward")}

      key == "s" && not is_nil(socket.assigns.selected) ->
        {:noreply, assign(socket, :selected, nil)}

      true ->
        {:noreply, socket}
    end
  end

  defp agent_positions(socket, time \\ nil) do
    time = if is_nil(time), do: socket.assigns.time  * 1000, else: time * 1000

    socket.assigns.video.markers
    |> Enum.group_by(fn {id, _, _, _} -> id end, fn {_, t, x, y} -> {t, x, y} end)
    |> Enum.into(%{}, fn {id, markers} ->

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
