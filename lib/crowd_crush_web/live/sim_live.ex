defmodule CrowdCrushWeb.SimLive do
  use Phoenix.LiveView

  alias CrowdCrush.Simulation
  alias CrowdCrushWeb.Router.Helpers, as: Routes

  require Logger

  @top 56
  @bot 47

  @width 1280
  @height 720

  def render(assigns), do: CrowdCrushWeb.SimView.render("index.html", assigns)

  def mount(%{"id" => youtubeID}, _session, socket) do

    case Simulation.get_video_by_youtube_id(youtubeID) do
      nil ->
        {:ok, socket
        |> put_flash(:error, "Error 404: The given video link was invalid.")
        |> push_redirect(to: Routes.live_path(socket, CrowdCrushWeb.VideoLive))}

      video ->
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
        |> update_positions()
        |> update_sim_params()
        |> assign(:changeset, Simulation.change_sim(video, %{}))

        # obstacle and marker management
        |> assign(:edit?, false)  # add or edit mode
        |> assign(:obs_x, nil)
        |> assign(:obs_y, nil)
        |> assign(:selected, nil)

        # toggles
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
    |> update_positions()
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
          |> update_positions()
          |> update_sim_params()}

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
        |> update_positions()
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
    |> update_positions()}
  end

  def handle_event("jump", %{"time" => time, "stopped" => stopped}, socket) do
    {:noreply, socket
    |> assign(:playing?, false)
    |> assign(:stopped?, stopped)
    |> assign(:time, time)
    |> update_positions()}
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

  def update_positions(socket) do
    cond do
      Enum.member?(["comparison", "markers"], socket.assigns.mode) ->
        positions =
          socket.assigns.agents
          |> positions(socket.assigns.time)
          |> Enum.map(fn {_id, pos} -> (if is_nil(pos), do: nil, else: [pos.x, pos.y]) end)

        assign(socket, :positions, positions)

      Enum.count(socket.assigns.agents) > 0 ->
        assign(socket, :positions, [])

      true ->
        socket
    end
  end

  def update_sim_params(socket) do
    goals =
      Enum.into(socket.assigns.agents, [], fn {_, m} -> [List.last(m).x, List.last(m).y] end)

    socket
    |> assign(:future_agents, future_agents(socket.assigns.agents))
    |> assign(:min_distance, get_min_distance(socket.assigns.positions))
    |> assign(:velocity, get_preferred_velocity(socket.assigns.agents, 0))
    |> assign(:goals, goals)
  end

  @doc """
  Gets the average speed of agents (rel for x and y) at a given time by calculating how far they have traveled 5 sec later
  """
  defp get_preferred_velocity(agents, time) do
    initial_positions = positions(agents, time)
    final_positions = positions(agents, time + 5)

    # only consider agents that were in the screen from start to end
    distances =
      agents
      |> Enum.map(fn {id, _pos} -> id end)
      |> Enum.reject(& is_nil(Map.get(initial_positions, &1)))
      |> Enum.reject(& is_nil(Map.get(final_positions, &1)))
      |> Enum.map(& dist(
        [Map.get(initial_positions, &1).x, Map.get(initial_positions, &1).y],
        [Map.get(final_positions, &1).x, Map.get(final_positions, &1).y]
      ))

    Enum.sum(distances) / Enum.count(distances)
  end

  def get_min_distance(positions) do
    positions = Enum.reject(positions, & is_nil(&1))

    positions
    |> Enum.map(fn pos1 ->
        positions
        |> Enum.map(& dist(pos1, &1))
        |> Enum.min()
      end) # find distance to closest neigbor
    |> Enum.min()
  end

  def dist([x1, y1], [x2, y2]) do
   :math.sqrt(abs(x1 - x2) * abs(x1 - x2) + abs(y1 - y2) * abs(y1 - y2))
  end

  defp positions(agents, time) do
    time = time * 1000

    Enum.into(agents, %{}, fn {id, markers} ->
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
  end

  # track first and last marker and remove all that have a starting time of 0
  defp future_agents(agents) do
    agents
    |> Enum.reject(fn {_k, markers} -> List.first(markers).time == 0 end)
    |> Enum.map(fn {_id, markers} ->
      start = List.first(markers)
      goal = List.last(markers)
      %{
        time: start.time / 1000,
        x: start.x,
        y: start.y,
        goal_x: goal.x,
        goal_y: goal.y
      }
    end)
  end
end
