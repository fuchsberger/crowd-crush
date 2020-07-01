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
        |> assign(:agent_goals, nil)
        |> assign(:agent_positions, [])
        |> assign(:duration, 0)
        |> assign(:paused, true)
        |> assign(:mode, "annotate")
        |> assign(:sim_changeset, Simulation.change_sim(video, %{}))
        |> assign(:show_settings, false)
        |> assign(:show_overlay, false)
        |> assign(:time, 0)
        |> assign(:user_id, Map.get(session, "user_id"))
        |> assign(:video, video)}
    end
  end

  def handle_event("set_duration", %{"duration" => duration}, socket) do
    {:noreply, assign(socket, :duration, floor(duration))}
  end

  def handle_event("set_mode", %{"mode" => mode}, socket) do
    case mode do
      "annotate" ->
        {:noreply, socket
        |> assign(:action, "stop")
        |> assign(:agent_positions, agent_positions(socket, 0))
        |> assign(:mode, mode)
        |> assign(:time, 0)}

      "sim" ->
        {:noreply, socket
        |> assign(:action, "prepare-sim")
        # starting positions of agents (at current time)
        |> assign(:agent_goals, agent_goals(socket.assigns.video.markers))
        |> assign(:agent_positions, agent_positions(socket, socket.assigns.time))
        |> assign(:mode, mode)}
    end
  end

  def handle_event("click", %{"x" => x, "y" => y}, socket) do
    case {socket.assigns.selected, Enum.count(socket.assigns.agent_positions)} do
      {nil, _count} ->
        # find closest agent and select it
        agent =
          socket.assigns.agent_positions
          |> Enum.sort_by(fn [_id, x1, y1] ->
              :math.sqrt(:math.pow(x1 - x, 2) + :math.pow(y1 - y, 2))
            end)
          |> List.first()

        case agent do
          nil -> {:noreply, socket}
          [id, _x, _y] -> {:noreply, assign(socket, :selected, id)}
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
    case Enum.count(socket.assigns.video.markers) do
      0 ->
        {:noreply, assign(socket, :selected, 1)}

      _count ->
        {id, _, _, _} = List.last(socket.assigns.video.markers)
        {:noreply, assign(socket, :selected, id + 1)}
    end
  end

  def handle_event("delete", _params, socket) do

    Simulation.delete_markers(socket.assigns.video, socket.assigns.selected)

    socket =
      assign(socket, :video, Simulation.get_video_by_youtube_id(socket.assigns.video.youtubeID))

    {:noreply, socket
    |> assign(:agent_positions, agent_positions(socket, socket.assigns.time))
    |> assign(:selected, nil)}
  end

  def handle_event("deselect", _params, socket), do: {:noreply, assign(socket, :selected, nil)}

  @doc """
  Control buttons only set the action.
  """
  def handle_event("control", %{"action" => action}, socket) do
    if action == "play" && socket.assigns.mode == "sim" do
      # when running simulation force the server to update
      Process.send_after(self(), :update, 16)

      {:noreply, socket
      |> assign(:action, "playing")
      |> assign(:time, 0)}
    else
      {:noreply, assign(socket, :action, action)}
    end
  end

  @doc """
  Ping events update agents, time and action.
  """
  def handle_event("ping", %{"action" => action, "time" => time}, socket) do
    {:noreply, socket
    |> assign(:action, (if time > socket.assigns.duration, do: "stop", else: action))
    |> assign(:agent_positions, agent_positions(socket, time))
    |> assign(:time, time)}
  end

  def handle_event("toggle-settings", _params, socket) do
    {:noreply, assign(socket, :show_settings, !socket.assigns.show_settings)}
  end

  def handle_event("toggle-overlay", _params, socket) do
    {:noreply, assign(socket, :show_overlay, !socket.assigns.show_overlay)}
  end

  def handle_event("keyup", %{"key" => key}, socket) do
    cond do
      socket.assigns.show_settings ->
        {:noreply, socket}

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

  def handle_event("validate-settings", %{"video" => params}, socket) do
    changeset = Simulation.change_sim(socket.assigns.video, params)
    {:noreply, assign(socket, :sim_changeset, changeset)}
  end

  def handle_event("update-settings", %{"video" => params}, socket) do
    case Simulation.update_sim(socket.assigns.video, params) do
      {:ok, video} ->
        {:noreply, socket
        |> assign(:action, "prepare-sim")
        |> assign(:agent_goals, agent_goals(socket.assigns.video.markers))
        |> assign(:agent_positions, agent_positions(socket, 0))
        |> assign(:mode, "sim")
        |> assign(:show_settings, false)
        |> assign(:sim_changeset, Simulation.change_sim(video, %{}))
        |> assign(:time, 0)
        |> assign(:video, Simulation.load_markers(video))}

      {:error, changeset} ->
        {:noreply, assign(socket, :sim_changeset, changeset)}
    end
  end

  defp agent_positions(socket, time \\ nil) do
    time = if is_nil(time), do: socket.assigns.time  * 1000, else: time * 1000

    socket.assigns.video.markers
    |> Enum.group_by(fn {id, _, _, _} -> id end, fn {_, t, x, y} -> {t, x, y} end)
    |> Enum.map(fn {id, markers} ->

      # find first marker where it's time is at or after current time
      case Enum.find_index(markers, fn {t, _x, _y} ->  t >= time end) do
        nil ->  # time is after last marker -> show nothing
          nil

        0 ->    # time is before or at first marker
          {t, x, y} = List.first(markers)
          case t == time do
            true -> [id, x, y]
            false -> nil
          end

        idx ->  # idx is the marker after, idx-1 the marker before -> approximate
          {t1, x1, y1 } = Enum.at(markers, idx-1)
          {t2, x2, y2 } = Enum.at(markers, idx)

          percentage = (time - t1) / (t2 - t1)
          x = x1 + (x2 - x1) * percentage
          y = y1 + (y2 - y1) * percentage
          [id, x, y]
      end
    end)
    # ignore agents that are not currently present
    |> Enum.reject(& is_nil(&1))
  end

  def handle_info(:update, %{assigns: %{action: action, time: time}} = socket) do
    if action == "playing" do
      Process.send_after(self(), :update, 16)
      {:noreply, assign(socket, :time, time + 0.016)}
    else
      {:noreply, socket
      |> assign(:action, "paused")
      |> assign(:agent_positions, agent_positions(socket, 0))
      |> assign(:time, 0)}
    end
  end

  # Find the last marker of each agent and create map of final agent positions.
  defp agent_goals(markers) do
    markers
    |> Enum.group_by(fn {id, _, _, _} -> id end, fn {_, t, x, y} -> {t, x, y} end)
    |> Enum.into(%{}, fn {id, markers} ->
      {_time, x, y } = List.last(markers)
      {id, [x, y]}
    end)
  end
end
