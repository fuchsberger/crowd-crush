defmodule CrowdCrushWeb.SimLive do
  use Phoenix.LiveView

  alias CrowdCrush.Simulation
  alias CrowdCrushWeb.Router.Helpers, as: Routes

  def render(assigns), do: CrowdCrushWeb.SimView.render("index.html", assigns)

  def mount(%{"id" => youtubeID}, _session, socket) do

    case Simulation.get_video_by_youtube_id(youtubeID) do
      nil ->
        {:ok, socket
        |> put_flash(:error, "Error 404: The given video link was invalid.")
        |> push_redirect(to: Routes.live_path(socket, CrowdCrushWeb.VideoLive))}

      video ->
        {:ok, socket

        # simulation related
        |> assign(:agent_goals, agent_goals(video.markers))
        |> assign(:agent_positions, agent_positions(video.markers, 0))
        |> assign(:changeset, Simulation.change_sim(video, %{}))
        |> assign(:mode, "play")
        |> assign(:video, video)

        # obstacle and marker management
        |> assign(:edit?, false)  # add or edit mode
        |> assign(:obs_x, nil)
        |> assign(:obs_y, nil)
        |> assign(:selected, nil)

        # toggles
        |> assign(:sim?, false)   # true - use simulation markers, false: use annotated markers
        |> assign(:show_goals?, false)
        |> assign(:show_markers?, true)
        |> assign(:show_obstacles?, false)
        |> assign(:show_settings?, false)
        |> assign(:show_video?, true)

        # player control
        |> assign(:time, 0.0)
        |> assign(:playing?, false)
        |> assign(:stopped?, true)}
    end
  end

  def handle_event("set", %{"mode" => mode}, socket) do
    case mode do
      "play" ->
        {:noreply, socket
        |> assign(:mode, mode)
        |> assign(:selected, nil)}

      "markers" ->
        {:noreply, socket
        |> assign(:mode, mode)
        |> assign(:selected, nil)
        |> assign(:sim?, false)
        |> assign(:show_goals?, false)
        |> assign(:show_markers?, true)
        |> assign(:show_obstacles?, false)
        |> assign(:show_video?, true)}

      "obstacles" ->
        {:noreply, socket
        |> assign(:mode, mode)
        |> assign(:selected, nil)
        |> assign(:sim?, false)
        |> assign(:show_goals?, false)
        |> assign(:show_markers?, false)
        |> assign(:show_obstacles?, true)
        |> assign(:show_video?, true)}
    end
  end

  # if play mode is selected, do nothing on click
  def handle_event("click", _params, %{assigns: %{mode: mode}} = socket) when mode == "play" do
    {:noreply, socket}
  end

  def handle_event("click", %{"x" => x, "y" => y}, %{assigns: %{mode: mode}} = socket) when mode == "markers" do
    if is_nil(socket.assigns.selected) do
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
    else
      # agent was selected, create marker at that time
      case Simulation.set_marker(%{
        agent: socket.assigns.selected,
        time: socket.assigns.time * 1000,
        video_id: socket.assigns.video.id,
        x: x,
        y: y
      }) do
        {:ok, _marker} ->
          video = Simulation.load_markers(socket.assigns.video)

          {:noreply, socket
          |> assign(:agent_positions, agent_positions(video.markers, socket.assigns.time))
          |> assign(:video, video)}

        {:error, _reason} ->
          {:noreply, socket}
      end
    end
  end

  def handle_event("click", %{"x" => x, "y" => y}, %{assigns: %{mode: mode}} = socket) when mode == "obstacles" do
    if socket.assigns.edit? && is_nil(socket.assigns.selected) do
      # find closest obstacle and select it
      obstacle =
        socket.assigns.video.obstacles
        |> Enum.sort_by(& min(
            :math.sqrt(:math.pow(&1.a_x - x, 2) + :math.pow(&1.a_y - y, 2)),
            :math.sqrt(:math.pow(&1.b_x - x, 2) + :math.pow(&1.b_y - y, 2))
          ))
        |> List.first()

      case obstacle do
        nil -> {:noreply, socket}
        %{id: id} -> {:noreply, assign(socket, :selected, id)}
      end
    else
      # obstacle was selected fill obs_x, obs_y, or insert to database
      if is_nil(socket.assigns.obs_x) do
        {:noreply, socket
        |> assign(:obs_x, x)
        |> assign(:obs_y, y)}
      else
        case Simulation.set_obstacle(socket.assigns.selected, %{
          video_id: socket.assigns.video.id,
          a_x: socket.assigns.obs_x,
          a_y: socket.assigns.obs_y,
          b_x: x,
          b_y: y
        }) do
          {:ok, _obstacle} ->
            video = Simulation.load_obstacles(socket.assigns.video)

            {:noreply, socket
            |> assign(:obs_x, x)
            |> assign(:obs_y, y)
            |> assign(:video, video)}

          {:error, _reason} ->
            {:noreply, socket}
        end
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

  def handle_event("toggle-cancel", _params, socket) do

    case { socket.assigns.selected, socket.assigns.mode } do
      {nil, _mode} ->
        {:noreply, socket}

      {id, "markers"} ->
        Simulation.delete_markers(socket.assigns.video, socket.assigns.selected)

        socket =
          assign(socket, :video, Simulation.get_video_by_youtube_id(socket.assigns.video.youtubeID))

        {:noreply, socket
        |> assign(:agent_positions, agent_positions(socket, socket.assigns.time))
        |> assign(:selected, nil)}

      {id, "obstacles"} ->
        Simulation.delete_obstacle!(socket.assigns.selected)

        {:noreply, socket
        |> assign(:selected, nil)
        |> assign(:video, Simulation.load_obstacles(socket.assigns.video))}
    end
  end

  def handle_event("deselect", _params, socket) do
    {:noreply, socket
    |> assign(:obs_x, nil)
    |> assign(:obs_y, nil)
    |> assign(:selected, nil)}
  end

  @doc """
  Control buttons only set the action.
  """
  def handle_event("control", %{"action" => action}, socket) do
    if action == "play" && socket.assigns.mode == "play-synth" do
      # when running simulation force the server to update
      Process.send_after(self(), :update, 16)

      {:noreply, socket
      |> assign(:action, "playing")
      |> assign(:time, 0.0)}
    else
      {:noreply, assign(socket, :action, action)}
    end
  end

  @doc """
  Ping events update agents, time and action.
  """
  def handle_event("ping", %{"time" => time}, socket) do
    {:noreply, socket
    |> assign(:agent_positions, agent_positions(socket.assigns.video.markers, time))
    |> assign(:playing?, true)
    |> assign(:stopped?, false)
    |> assign(:time, time)}
  end

  def handle_event("jump", %{"time" => time, "stopped" => stopped}, socket) do
    {:noreply, socket
    |> assign(:agent_positions, agent_positions(socket.assigns.video.markers, time))
    |> assign(:playing?, false)
    |> assign(:stopped?, stopped)
    |> assign(:time, time)}
  end

  def handle_event("toggle-obstacles", _params, socket) do
    {:noreply, assign(socket, :show_obstacles?, !socket.assigns.show_obstacles?)}
  end

  def handle_event("toggle-markers", _params, socket) do
    {:noreply, assign(socket, :show_markers?, !socket.assigns.show_markers?)}
  end

  def handle_event("toggle-goals", _params, socket) do
    {:noreply, assign(socket, :show_goals?, !socket.assigns.show_goals?)}
  end

  def handle_event("toggle-settings", _params, socket) do
    {:noreply, assign(socket, :show_settings?, !socket.assigns.show_settings?)}
  end

  def handle_event("toggle-add", _params, socket) do
    {:noreply, assign(socket, :edit?, false)}
  end

  def handle_event("toggle-edit", _params, socket) do
    {:noreply, assign(socket, :edit?, true)}
  end

  def handle_event("toggle-sim", _params, socket) do
    {:noreply, assign(socket, :sim?, !socket.assigns.sim?)}
  end

  def handle_event("toggle-video", _params, socket) do
    {:noreply, assign(socket, :show_video?, !socket.assigns.show_video?)}
  end

  def handle_event("validate-settings", %{"video" => params}, socket) do
    {:noreply, assign(socket, :changeset, Simulation.change_sim(socket.assigns.video, params))}
  end

  def handle_event("update-settings", %{"video" => params}, socket) do
    case Simulation.update_sim(socket.assigns.video, params) do
      {:ok, video} ->
        {:noreply, socket
        |> assign(:show_settings?, false)
        |> assign(:changeset, Simulation.change_sim(video, %{}))
        |> assign(:video, Simulation.load_markers(video))}

      {:error, changeset} ->
        {:noreply, assign(socket, :changeset, changeset)}
    end
  end

  defp agent_positions(markers, time) do
    time = time * 1000

    markers
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
