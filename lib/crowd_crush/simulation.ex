defmodule CrowdCrush.Simulation do
  @moduledoc """
  Provides database helpers for retrieving, updating and deleting simulations
  context. This includes markers, videos, and overlays.
  """

  import Ecto.Query
  import CrowdCrush.Service.Simulation

  alias CrowdCrush.Repo
  alias CrowdCrush.Simulations.{ Overlay, Marker, Video }

  def create_video(attrs \\ %{}) do
    %Video{}
    |> Video.changeset(attrs)
    |> Repo.insert()
  end

  def delete_video(video), do: Repo.delete(video)

  def get_video(id) do

    overlay_query = from(o in Overlay, select: [ o.title, o.youtubeID ])

    marker_query = from(m in Marker,
      select: {m.agent, m.time, m.x, m.y},
      order_by: [m.agent, m.time]
    )

    from(v in Video, preload: [overlays: ^overlay_query, markers: ^marker_query])
    |> Repo.get(id)
  end

  def get_video!(id), do: Repo.get! Video, id

  def list_videos, do: Repo.all(from v in Video,
    select: map(v, ~w(id title duration youtubeID)a),
    order_by: v.title
  )

  def get_video_by_youtube_id(id) do

    overlay_query = from(o in Overlay, select: [ o.title, o.youtubeID ])

    marker_query = from(m in Marker,
      select: {m.agent, m.time, m.x, m.y},
      order_by: [m.agent, m.time]
    )

    from(v in Video, preload: [overlays: ^overlay_query, markers: ^marker_query])
    |> Repo.get_by(youtubeID: id)
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

  def update_video(%Video{} = video, attrs) do
    video
    |> Video.changeset(attrs)
    |> Repo.update()
  end

  def update_videos(ids, changes) do
    # todo: VALIDATION MISSING
    params = Enum.map(changes, fn({k, v}) -> {String.to_atom(k), v} end)

    from(v in Video, where: v.id in ^ids)
    |> Repo.update_all([set: params], [returning: true])
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

  @doc """
  Deletes all markers of a given video that belong to the given agent.
  If no agent is given, deletes all markers of all agents.
  """
  def delete_markers(%Video{} = video, agent) do
    if is_nil(agent),
      do: Repo.delete_all(from(m in Ecto.assoc(video, :markers))),
      else: Repo.delete_all(from(m in Ecto.assoc(video, :markers), where: m.agent == ^agent))
  end

  @doc """
  Attempts to create or update a marker
  get_agent_id is used when a new agent is created (gives highest id + 1)
  """
  def set_marker(video_id, params) do
    agent = params["agent"] || get_next_agent(video_id)

    get_marker(video_id, agent, params["time"])
      |> Marker.changeset(%{
          agent:    agent,
          time:     params["time"] * 1000,
          video_id: video_id,
          x:        params["x"],
          y:        params["y"],
        })
      |> Repo.insert_or_update
  end

  # Returns a new agent_id (that has not been used before)
  defp get_next_agent(video_id) do
    case Repo.one(from m in Marker, select: max(m.agent), where: m.video_id == ^video_id) do
      nil -> 1
      max -> max + 1
    end
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
end
