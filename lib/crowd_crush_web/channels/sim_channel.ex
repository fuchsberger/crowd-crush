# User Channel (all functionality associated with an authentificated user)

defmodule CrowdCrushWeb.SimChannel do

  use CrowdCrushWeb, :channel
  alias CrowdCrush.Simulation
  alias CrowdCrushWeb.{MarkerView, OverlayView}
  # alias CrowdCrushWeb.Endpoint

  @doc """
  Join simulation.
  """
  def join("sim:"<> video_id, params, socket) do
    case Simulation.get_video(video_id) do
      nil ->
        {:error, %{ error: "No video with this ID."}}
      video ->
        last_seen = NaiveDateTime.from_iso8601!(params["last_seen"])
        markers = Simulation.list_markers(video, last_seen)
        overlays = Simulation.get_overlays(video)

        res = %{
          last_seen: last_seen,
          markers: View.render_many(markers, MarkerView, "marker.json"),
          overlays: View.render_many(overlays, OverlayView, "overlay.json")
        }

        # if abs=true in params, convert markers to abs, otherwise leave rel
        # res = if Map.get(params, "abs", false) do
        #   Map.put(res, :markers, get_csv_markers(video_id))
        # else
        #   Map.put(res, :markers, list_markers( video_id, syncTime ))
        # end

        { :ok, res, assign(socket, :video_id, video.id) }
    end
  end


  def handle_in("create_overlay", overlay_params, socket) do

    video = Simulation.get_video!(socket.assigns.video_id)

    case Simulation.create_overlay(video, overlay_params) do
      {:ok, overlay} ->
        broadcast! socket, "add_overlay", View.render_one(overlay, OverlayView, "overlay.json")
        return_success socket

      {:error, _changeset} ->
        return_error socket
    end
  end

  def handle_in("delete_overlay:" <> overlay_id, _params, socket) do
    overlay = Simulation.get_overlay!(overlay_id)

    case Simulation.delete_overlay(overlay) do
      {:ok, _overlay} ->
        broadcast! socket, "remove_overlay", %{ id: overlay.id }
        return_success socket

      {:error, _changeset} ->
        return_error socket
    end
  end

  def handle_in("delete_markers:all", _params, socket) do
    socket.assigns.video_id
    |> Simulation.get_video!()
    |> Simulation.delete_markers()

    broadcast! socket, "remove_markers", %{}

    {:noreply, socket}
  end

  def handle_in("delete_markers:" <> agent, _params, socket) do
    socket.assigns.video_id
    |> Simulation.get_video!()
    |> Simulation.delete_markers(agent)

    broadcast! socket, "remove_markers", %{ agent: String.to_integer(agent) }

    {:noreply, socket}
  end

  def handle_in("set_marker", marker_params, socket) do
    case Simulation.set_marker(socket.assigns.video_id, marker_params) do
      {:ok, marker} ->
        broadcast! socket, "set_marker", View.render_one(marker, MarkerView, "marker.json")
        {:reply, {:ok, %{ agent: marker.agent }}, socket}
      {:error, _changeset} ->
        {:noreply, socket}
    end
  end

  # def handle_in("update_video", params, socket) do
  #   case update_video socket.assigns.video_id, params do
  #     {:ok, video} ->
  #       broadcast! socket, "update_video", render_video(video)
  #       Endpoint.broadcast "public", "update_videos", %{videos: [render_video(video)]}
  #       return_ok socket, "Video was created successfully."
  #     {:error, _changeset} ->
  #       return_error socket, "The video could not be updated"
  #   end
  # end

  def terminate(_msg, socket), do: assign(socket, :video_id, nil)
end
