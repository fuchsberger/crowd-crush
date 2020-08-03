defmodule CrowdCrushWeb.SimLive do
  use Phoenix.LiveView

  alias CrowdCrush.Simulation
  alias CrowdCrushWeb.Router.Helpers, as: Routes

  @top 56
  @bot 47

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
        |> assign(:time, 0.0)
        |> assign(:video, group_markers(video))
        |> assign_agent_positions()
        |> assign_agent_goals()
        |> assign_future_agents()
        |> assign(:changeset, Simulation.change_sim(video, %{}))
        |> assign(:mode, "video")
        |> assign(:style, "top:#{@top}px;left:0;width:100%;height:calc(100% - #{@top + @bot}px);")

        # obstacle and marker management
        |> assign(:edit?, false)  # add or edit mode
        |> assign(:obs_x, nil)
        |> assign(:obs_y, nil)
        |> assign(:selected, nil)

        # toggles
        |> assign(:show_goals?, true)     # default: false
        |> assign(:show_settings?, false)

        # player control
        |> assign(:playing?, false)
        |> assign(:stopped?, true)}
    end
  end

  def handle_event("set", %{"mode" => mode}, socket) do
    {:noreply, socket
    |> assign(:mode, mode)
    |> assign(:selected, nil)
    |> assign(:time, 0)
    |> assign_agent_positions()
    |> update_style()
    |> assign(:playing?, false)
    |> assign(:stopped?, true)}
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
        |> Enum.map(fn {id, pos} -> [id, pos.x, pos.y] end)
        |> Enum.sort_by(fn [_id, x1, y1] ->
            :math.sqrt(:math.pow(x1 - x, 2) + :math.pow(y1 - y, 2))
          end)
        |> List.first() # gets [id, x, y]
        |> List.first() # gets id

      {:noreply, assign(socket, :selected, agent)}

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
          {:noreply, socket
          |> assign(:video, Simulation.load_markers(socket.assigns.video) |> group_markers())
          |> assign_agent_goals()
          |> assign_agent_positions()}

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
        Simulation.delete_markers(socket.assigns.video, id)

        {:noreply, socket
        |> assign(:video, Simulation.get_video_by_youtube_id(socket.assigns.video.youtubeID))
        |> assign_agent_positions()
        |> assign(:selected, nil)}

      {id, "obstacles"} ->
        Simulation.delete_obstacle!(id)

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
  Ping events update agents, time and action.
  """
  def handle_event("ping", %{"time" => time}, socket) do
    {:noreply, socket
    |> assign(:playing?, true)
    |> assign(:stopped?, false)
    |> assign(:time, time)
    |> assign_agent_positions()}
  end

  def handle_event("jump", %{"time" => time, "stopped" => stopped}, socket) do
    {:noreply, socket
    |> assign(:playing?, false)
    |> assign(:stopped?, stopped)
    |> assign(:time, time)
    |> assign_agent_positions()}
  end

  def handle_event("resize", %{"width" => width, "height" => height}, socket) do
    {:noreply, socket
    |> assign(:height, height - @top - @bot)
    |> assign(:width, width)
    |> update_style()}
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

  defp assign_agent_goals(%{ assigns: %{ video: %{ markers: markers }}} = socket) do
    goals = Enum.into(markers, %{}, fn {id, m} -> {id, Map.take(List.last(m), [:x, :y])} end)
    assign(socket, :agent_goals, goals)
  end

  defp assign_agent_positions(%{assigns: %{video: %{markers: markers}, time: time}} = socket) do

    time = time * 1000

    positions =
      Enum.into(markers, %{}, fn {id, markers} ->
        # find first marker where it's time is at or after current time
        case Enum.find_index(markers, fn %{time: t} ->  t >= time end) do
          nil ->  # time is after last marker -> show nothing
            {id, nil}

          0 ->    # time is before or at first marker
            m = List.first(markers)
            case time == m.time do
              true -> {id, Map.take(m, [:x, :y])}
              false -> {id, nil}
            end

          index ->  # idx is the marker after, idx-1 the marker before -> approximate
            m1 = Enum.at(markers, index-1)
            m2 = Enum.at(markers, index)
            percentage = (time - m1.time) / (m2.time - m1.time)

            {id, %{
              x: m1.x + (m2.x - m1.x) * percentage,
              y: m1.y + (m2.y - m1.y) * percentage
            }}
        end
      end)

    assign(socket, :agent_positions, positions)
  end

  # track first and last marker and remove all that have a starting time of 0
  defp assign_future_agents(%{assigns: %{video: %{markers: markers}}} = socket) do
    agents = Enum.map(markers, fn {agent, markers} ->
      start = List.first(markers)
      goal = List.last(markers)
      %{
        id: agent,
        time: start.time / 1000,
        x: start.x,
        y: start.y,
        goal_x: goal.x,
        goal_y: goal.y
      }
    end)
    |> Enum.filter(& &1.time > 0)

    assign(socket, :future_agents, agents)
  end

  defp group_markers(video) do
    markers = Enum.group_by(video.markers, & &1.agent, & Map.take(&1, [:agent, :time, :x, :y]))
    Map.put(video, :markers, markers)
  end

  defp update_style(socket) do
    ratio = socket.assigns.video.aspectratio
    height = socket.assigns.height
    width = socket.assigns.width

    # calculate pixel size of wrapper
    {w, h} =
      case socket.assigns.mode do
        "comparison" ->
          IO.inspect {height * ratio * 2, width}
          if height * ratio * 2 < width,
            do: {2 * height * ratio, height},
            else: {width, width / 2 / ratio}
        _ ->
          if ratio > width / height,
            do: {width, width / ratio},
            else: {height * ratio, height}
      end

    # calculate left / top offset (to center wrapper)
    top = if h < height, do: @top + (height - h) / 2, else: @top
    left = if w < width, do: (width - w) / 2, else: 0

    style = "top:#{round(top)}px;left:#{round(left)}px;width:#{round(w)}px;height:#{round(h)}px;"
    assign(socket, :style, style)
  end
end
