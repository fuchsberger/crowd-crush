defmodule CrowdCrush.Simulation do
  @moduledoc """
  Provides database helpers for retrieving, updating and deleting simulations
  context. This includes markers, videos, and overlays.
  """

  import Ecto.Query
  import CrowdCrush.Service.Simulation

  alias CrowdCrush.Repo
  alias CrowdCrush.Simulation.{ Obstacle, Overlay, Marker, Video }

  def get_video!(id), do: Repo.get! Video, id

  def change_video(%Video{} = video, params), do: Video.changeset(video, params)

  def change_video(%Video{} = video, params, :rename), do: Video.rename_changeset(video, params)

  def create_video(attrs \\ %{}) do
    %Video{}
    |> Video.changeset(attrs)
    |> Repo.insert()
  end

  def rename_video(video, attrs) do
    video
    |> Video.rename_changeset(attrs)
    |> Repo.update()
  end

  def update_video(video, attrs \\ %{}) do
    video
    |> Video.changeset(attrs)
    |> Repo.update()
  end

  def delete_video(id), do: Repo.get(Video, id) |> Repo.delete()

  def list_videos do
    Repo.all from v in Video,
      order_by: v.title,
      preload: [markers: ^from(m in Marker, group_by: m.video_id, select: count())]
  end

  def get_video_by_youtube_id(id) do
    Repo.get_by(from(v in Video, preload: [
      markers: ^marker_query(),
      obstacles: ^obstacle_query()
    ]), youtubeID: id)
  end

  def get_video_details(video_id) do
    from(v in Video, select: map(v, ~w(aspectratio m0_x m0_y mX_x mX_y mY_x mY_y
      mR_x mR_y dist_x dist_y youtubeID)a))
    |> Repo.get(video_id)
  end

  def lock_videos(videos, status) do
    from( v in Video, where: v.id in ^videos)
    |> Repo.update_all([set: [locked: !!status]], [returning: true])
  end

  def update_videos(ids, changes) do
    # todo: VALIDATION MISSING
    params = Enum.map(changes, fn({k, v}) -> {String.to_atom(k), v} end)

    from(v in Video, where: v.id in ^ids)
    |> Repo.update_all([set: params], [returning: true])
  end

  # SIMULATION SPECIFIC

  def change_sim(%Video{} = video, params), do: Video.changeset_simulation(video, params)

  def update_sim(video, attrs \\ %{}) do
    video
    |> Video.changeset_simulation(attrs)
    |> Repo.update()
  end

  @doc """
  Gets all agents, assumes that markers are sorted by first agent and then time
  """
  def get_agents(markers) do
    agents = Enum.group_by(markers, &List.first/1, fn m -> List.delete_at(m, 0) end)
    {agents, Enum.count(agents), Enum.count(markers)}
  end

  # OVERLAYS
  def get_overlay!(id), do: Repo.get!(Overlay, id)

  def create_overlay(%Video{} = video, attrs \\ %{}) do
    %Overlay{}
    |> Overlay.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:video, video)
    |> Repo.insert()
  end

  def delete_overlay(%Overlay{} = overlay), do: Repo.delete(overlay)

  @doc """
  Gets all markers, sorted by first agent, then time.
  """
  def get_csv_markers(video_id) do
    refs = createAbsRefs get_video!(video_id)
    Repo.all(from m in Marker,
      select: [m.agent, m.time, m.x, m.y],
      order_by: [m.agent, m.time],
      where: m.video_id == ^video_id
    )
    |> Enum.map(fn(m) -> to_abs_coords(refs, m) end)
  end

  def get_csv_agents(markers) do
    markers
    |> Enum.group_by( &List.first/1, fn x -> List.delete_at(x, 0) end)
    |> Enum.into([], fn {_k, x} -> Enum.concat(List.first(x), List.last(x)) end)
  end

  def delete_markers(%Video{} = video, agent) do
    case agent do
      nil ->
        video
        |> Ecto.assoc(:markers)
        |> Repo.delete_all()
      id ->
        from(m in Ecto.assoc(video, :markers), where: m.agent == ^id)
        |> Repo.delete_all()
    end
  end

  @doc """
  Attempts to create or update a marker
  get_agent_id is used when a new agent is created (gives highest id + 1)
  """
  def set_marker(params) do
    get_marker(params.video_id, params.agent, params.time)
    |> Marker.changeset(params)
    |> Repo.insert_or_update()
  end

  @doc """
  Gets a specific marker, given a video_id, agent_id, and time
  returns empty structure if none was found
  """
  def get_marker(video_id, agent, time) do
    case Repo.get_by(Marker, video_id: video_id, agent: agent, time: time ) do
      nil  -> %Marker{}   # Marker not found, we build new one
      marker -> marker    # Marker exists, let's use it
    end
  end

  def load_markers(video), do: Repo.preload(video, [markers: marker_query()], force: true)
  def load_obstacles(video), do: Repo.preload(video, [obstacles: obstacle_query()], force: true)

  def set_obstacle(nil, params) do
    %Obstacle{}
    |> Obstacle.changeset(params)
    |> Repo.insert_or_update()
  end

  def set_obstacle(id, params) do
    Obstacle
    |> Repo.get(id)
    |> Obstacle.changeset(params)
    |> Repo.insert_or_update()
  end

  def delete_obstacle!(id) do
    Obstacle
    |> Repo.get!(id)
    |> Repo.delete!()
  end

  defp marker_query do
    from m in Marker, select: {m.agent, m.time, m.x, m.y}, order_by: [m.agent, m.time]
  end

  defp obstacle_query, do: from o in Obstacle, select: map(o, [:id, :a_x, :a_y, :b_x, :b_y])
end
