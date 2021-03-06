defmodule CrowdCrushWeb.SimLive do
  use Phoenix.LiveView

  alias CrowdCrush.Simulation
  alias CrowdCrushWeb.Router.Helpers, as: Routes

  require Logger

  @width 1280
  @height 720

  # squares of that size (pixel) will be used to determine agent direction and speed
  @grid_size 42

  def render(assigns), do: CrowdCrushWeb.SimView.render("index.html", assigns)

  def mount(%{"id" => youtubeID}, _session, socket) do

    case Simulation.get_video_by_youtube_id(youtubeID) do
      nil ->
        {:ok, socket
        |> put_flash(:error, "Error 404: The given video link was invalid.")
        |> push_redirect(to: Routes.live_path(socket, CrowdCrushWeb.VideoLive))}

      video ->

        Logger.warn(inspect(min_distance()))
        {:ok, socket
        |> assign(:video, video)
        |> assign(:mode, "comparison")

        # canvas settings
        |> assign(:width, @width)
        |> assign(:height, @height)
        |> update_canvas()

        # simulation related
        |> assign(:time, 0.0)
        |> assign(:flipped?, false)
        |> update_agents()
        |> assign_positions()
        |> assign_grid()
        |> assign_min_distance()
        |> assign_preferred_velocity()
        |> assign_agents()

        |> assign(:changeset, Simulation.change_sim(video, %{}))

        # obstacle and marker management
        |> assign(:edit?, false)  # add or edit mode
        |> assign(:obs_x, nil)
        |> assign(:obs_y, nil)
        |> assign(:selected, nil)

        # toggles
        |> assign(:show_grid?, false)       # default: false
        |> assign(:show_goals?, false)     # default: false
        |> assign(:show_settings?, false)

        # player control
        |> assign(:playing?, false)
        |> assign(:stopped?, true)}
    end
  end

  def handle_event("set", %{"mode" => mode}, socket) do
    {:noreply, socket
    |> assign(:mode, mode)
    |> update_canvas()
    |> assign(:time, 0)
    |> update_agents()
    |> assign_agents()
    |> assign_positions()
    |> assign_grid()
    |> assign(:selected, nil)
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
          |> assign(:video, Simulation.load_markers(socket.assigns.video))
          |> update_agents()
          |> assign_positions()
          |> assign_min_distance()
          |> assign_agents()
          |> assign_preferred_velocity()}

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
        |> assign_positions()
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
    |> assign_positions()}
  end

  def handle_event("jump", %{"time" => time, "stopped" => stopped}, socket) do
    {:noreply, socket
    |> assign(:playing?, false)
    |> assign(:stopped?, stopped)
    |> assign(:time, time)
    |> assign_positions()}
  end

  def handle_event("toggle-grid", _params, socket) do
    {:noreply, assign(socket, :show_grid?, !socket.assigns.show_grid?)}
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

  defp update_canvas(socket) do
    # if comparsion is activated, fit two videos next to each other
    r = if socket.assigns.mode == "comparison",
      do: 2 * socket.assigns.video.aspectratio,
      else: socket.assigns.video.aspectratio

    # calculate pixel size of canvas (set longer side to 100%, scale short side)
    {w, h} = if r > @width / @height,
      do: {@width, round(@width / r)},
      else: {round(@height * r), @height}

    socket
    |> assign(:x_gap, round((@width - w) / 2))
    |> assign(:y_gap, round((@height - h) / 2))
    |> assign(:cwidth, w)
    |> assign(:cheight, h)
  end

  def update_agents(socket) do
    comparison? = socket.assigns.mode == "comparison"

    agents =
      socket.assigns.video.markers
      |> Enum.group_by(& &1.agent, & %{
        time: &1.time,
        x: abs(socket.assigns.cwidth, &1.x, comparison?, socket.assigns.flipped?),
        y: socket.assigns.cheight * &1.y,
      })

    assign(socket, :agents, agents)
  end

  defp abs(length, x, comparison?, flipped?) do
    case {comparison?, flipped?} do
      {true, true} -> round(length/2 + x * length/2)
      {true, false} -> round(x * length/2)
      {false, _} -> round(x * length)
    end
  end

  @doc """
  Gets the average speed of agents (rel for x and y) at a given time by calculating how far they have traveled / time it took them using their first marker
  """
  defp assign_preferred_velocity(socket) do
    velocities =
      socket.assigns.agents
      |> Enum.filter(fn {_id, markers} -> Enum.count(markers) > 1 end)
      |> Enum.map(fn {_id, markers} ->

        m1 = List.first(markers)
        m2 = Enum.at(markers, 1)

        dist([m1.x, m1.y], [m2.x, m2.y]) / (m2.time - m1.time)
      end)

    preferred_velocity =
      case Enum.count(velocities) > 0 do
        true -> Enum.sum(velocities) / Enum.count(velocities)
        false -> 0
      end

    preferred_velocity = if socket.assigns.mode == "comparison",
      do: preferred_velocity * 0.5,
      else: preferred_velocity

    assign(socket, :velocity, preferred_velocity)
  end

  def assign_min_distance(socket) do
    min_distance =
      if Enum.count(socket.assigns.positions) > 0 do
        socket.assigns.positions
        |> Enum.map(fn pos1 ->
          socket.assigns.positions
            |> Enum.map(& dist(pos1, &1))
            |> Enum.min()
          end) # find distance to closest neigbor
        |> Enum.min()
        else
        5
      end

    assign(socket, :min_distance, min_distance)
  end

  @doc """
  Computes the distance between the two closest points in a list.
  Returns nil if list is empty or all points overlap.
  """
  @spec min_distance(list[tuple()]) :: float() | nil
  def min_distance(list \\ [{2, 2}, {1, 1}, {2, 1}, {3, 1}]) do
    list
    |> Enum.map(fn {x1, y1} ->
        list
        |> Enum.reject(fn {x2, y2} -> x1 == x2 && y1 == y2 end)
        |> Enum.map(fn {x2, y2} -> dist(x1, y1, x2, y2) end)
        |> Enum.min()
      end)
    |> Enum.min()
  end

  # Computes the distance between two points.
  defp dist(x1, y1, x2, y2), do: :math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))


  def assign_grid(socket) do
    %{agents: agents, cwidth: width, cheight: height, mode: mode} = socket.assigns

    grid_size = if mode == "comparison", do: div(@grid_size, 2), else: @grid_size
    x_max = if mode == "comparison", do: div(width, 2), else: width

    # for each cell find markers that start in that cell and look at their next target
    grid_vectors =
      Enum.map(0..div(height, grid_size), fn y ->
        Enum.map(0..div(x_max, grid_size), fn x ->
          grid_markers =
            agents
            # go through each agent and find all markers
            |> Enum.map(fn {_id, markers} ->
              # convert into {x, y, dist, angle}
              Enum.map(0..(Enum.count(markers) - 2), fn idx ->
                current = Enum.at(markers, idx)
                next = Enum.at(markers, idx+1)
                {
                  current.x,
                  current.y,
                  next.x,
                  next.y
                }
              end)
              # filter all agent's markers to only include those that start in that cell
              |> Enum.filter(fn {marker_x, marker_y, _x2, _y2} ->
                marker_x >= x * grid_size
                && marker_x < (x+1) * grid_size
                && marker_y >= y * grid_size
                && marker_y < (y+1) * grid_size
              end)
            end)
            |> Enum.reject(& &1 == [])
            |> List.flatten()

          x_diff =
            if Enum.count(grid_markers) > 0 do
              grid_markers
              |> Enum.map(fn {x1, _y, x2, _y2} -> x2 - x1 end)
              |> Enum.sum()
              |> Kernel./(Enum.count(grid_markers))
            else
              0
            end

          y_diff =
            if Enum.count(grid_markers) > 0 do
              grid_markers
              |> Enum.map(fn {_x1, y1, _x2, y2} -> y2 - y1 end)
              |> Enum.sum()
              |> Kernel./(Enum.count(grid_markers))
            else
              0
            end

          # return averaged x and y diff (represents vector)
          [x_diff, y_diff]
        end)
      end)

    socket
    |> assign(:grid_size, grid_size)
    |> assign(:grid_vectors, grid_vectors)
  end

  defp dist([x1, y1], [x2, y2]) do
   :math.sqrt(abs(x1 - x2) * abs(x1 - x2) + abs(y1 - y2) * abs(y1 - y2))
  end

  defp dist(_, _), do: 0

  # gets current positions of annotated markers
  defp assign_positions(socket) do
    time = socket.assigns.time * 1000
    positions =
      socket.assigns.agents
      |> Enum.into(%{}, fn {id, markers} ->
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
      |> Enum.map(fn {_id, pos} -> (if is_nil(pos), do: nil, else: [pos.x, pos.y]) end)
      |> Enum.reject( & is_nil(&1))

    assign(socket, :positions, positions)
  end

  defp assign_agents(socket) do
    agents =
      Enum.map(socket.assigns.agents, fn {_id, markers} ->
        start = List.first(markers)
        goal = List.last(markers)
        %{
          time: start.time / 1000,
          x: adjust_x(socket, start.x),
          y: start.y,
          goal_x: adjust_x(socket, goal.x),
          goal_y: goal.y
        }
      end)
    assign(socket, :sim_agents, agents)
  end

  defp adjust_x(socket, x) do
    case socket.assigns.mode do
      "comparison" ->
        if socket.assigns.flipped?, do: x, else: x + @width / 2
      _ ->
        x
    end
  end
end
