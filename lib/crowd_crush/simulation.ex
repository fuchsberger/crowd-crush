defmodule CrowdCrush.Simulation do
  @moduledoc """
  Provides database helpers for retrieving, updating and deleting simulations
  context. This includes markers, videos, and overlays.
  """

  import Ecto.Query
  import CrowdCrush.Service.Simulation

  alias CrowdCrush.Repo
  alias Phoenix.View
  alias CrowdCrush.Simulations.Overlay
  alias CrowdCrush.Simulations.Marker
  alias CrowdCrush.Simulations.Video
  alias CrowdCrushWeb.VideoView

  def create_video(attrs \\ %{}) do
    %Video{}
    |> Video.changeset(attrs)
    |> Repo.insert()
  end

  def delete_videos(videos) do
    from(v in Video, where: v.id in ^videos and not v.locked)
    |> Repo.delete_all([returning: [:id]])
  end

  def get_video(id) do
    Repo.get Video, id
  end

  def get_video!(id) do
    Repo.get! Video, id
  end

  # get video by youtube id
  def get_video(id, :youtube) do
    Repo.get_by(Video, [youtubeID: id])
    |> Repo.preload([markers: from(m in Marker,
        select: [m.agent, m.time, m.x, m.y],
        order_by: [m.agent, m.time])
       ])
  end

  def list_videos(syncTime) do
    videos = from(v in Video,
      # join: m in assoc(v, :markers),
      select: %{
        id: v.id,
        title: v.title,
        # marker_count: count(m.id),
        inserted_at: v.inserted_at,
        youtubeID: v.youtubeID
      },
      # group_by: v.id,
      where: v.updated_at > ^syncTime)
    |> Repo.all()
    |> View.render_many(VideoView, "video.json")

    { NaiveDateTime.utc_now(), videos }
  end

  def get_video_details(video_id) do
    from(v in Video, select: map(v, ~w(aspectratio m0_x m0_y mX_x mX_y mY_x mY_y
      mR_x mR_y dist_x dist_y youtubeID)a))
    |> Repo.get(video_id)
  end

  @doc """
    called when joining sim channel
  """
  @spec list_markers(integer, NaiveDateTime.t) :: list
  def list_markers(video_id, syncTime) do
    from(m in Marker,
      select: [m.agent, m.time, m.x, m.y],
      limit: 100000,
      order_by: [asc: m.agent, asc: m.time],
      where: m.video_id == ^video_id and m.updated_at > ^syncTime
    )
    |> Repo.all()
  end

  def render_video(video) do
    video
    |> Repo.preload(:markers)
    |> View.render_one(VideoView, "video.json")
  end

  def render_videos(videos) do
    videos
    |> Repo.preload(:markers)
    |> View.render_many(VideoView, "video.json")
    |> Enum.into(%{}, fn v -> {v.id, Map.delete(v, :id)} end)
  end

  def lock_videos(videos, status) do
    from( v in Video, where: v.id in ^videos)
    |> Repo.update_all([set: [locked: !!status]], [returning: true])
  end

  def update_video(id, params) do
    Repo.get!(Video, id)
    |> Video.changeset(params)
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

  @doc """
  Returns a new agent_id (that has not been used before)
  """
  def get_agent_id(video_id) do
    case Repo.one from m in Marker,
      select: max(m.agent),
      where: m.video_id == ^video_id
    do
      nil -> 0
      max -> max + 1
    end
  end

  @doc """
  Removes a agent with a given video_id and agent_id
  Returns {#_deleted_markers, nil}
  """
  def remove_agent(video_id, agent) do
    from(m in Marker, where: [agent: ^agent, video_id: ^video_id])
    |> Repo.delete_all
  end

  def get_overlays(video_id) do
    Repo.all from o in Overlay,
      select: %{ title: o.title, youtubeID: o.youtubeID },
      order_by: o.title,
      where: [video_id: ^video_id]
  end

  def delete_overlay(video_id, youtubeID) do
    from(o in Overlay, where: [video_id: ^video_id, youtubeID: ^youtubeID])
    |> Repo.one
    |> Repo.delete
  end

  @doc """
  Gets all markers, sorted by  first agent, then time.
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
  Gets all markers of a given agent, sorted by time.
  """
  def get_markers(agent_id) do
    Repo.all from m in Marker,
      select: [m.time, m.x, m.y],
      order_by: m.time,
      where: m.agent == ^agent_id
  end

  @doc """
  Removes all agents of a given video
  """
  def remove_all_markers (video_id) do
    from(m in Marker, where: m.video_id == ^video_id)
      |> Repo.delete_all
  end

  def create_overlay(video_id, params) do
    case Repo.get_by(Overlay, youtubeID: params["youtubeID"] ) do
      nil  -> %Overlay{}  # Overlay not found, we build new one
      overlay -> overlay  # Overlay exists, let's use it
    end
    |> Overlay.changeset(%{
        title: params["title"],
        video_id: video_id,
        youtubeID: params["youtubeID"]
      })
    |> Repo.insert_or_update
  end

  @doc """
  Attempts to creates a marker
  get_agent_id is used when a new agent is created (gives highest id + 1)
  """
  def create_marker(video_id, params) do
    agent = params["agent"] || get_agent_id(video_id)
    get_marker(video_id, agent, params["time"])
      |> Marker.changeset(%{
          agent:    agent,
          time:     params["time"],
          video_id: video_id,
          x:        params["x"],
          y:        params["y"],
        })
      |> Repo.insert_or_update
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
