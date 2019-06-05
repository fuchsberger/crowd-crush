# User Channel (all functionality associated with an authentificated user)

defmodule CrowdCrushWeb.SimChannel do

  use CrowdCrushWeb, :channel
  import CrowdCrush.Simulation
  # alias CrowdCrushWeb.Endpoint

  @doc """
  Join simulation.
  """
  def join("sim:"<> video_id, params, socket) do
    case get_video_details(video_id) do
      nil ->
        {:error, %{ error: "No video with this ID."}}
      video ->
        syncTime = Map.get params, :syncTime, ~N[2000-01-01 10:00:00]

        res = %{
          syncTime: NaiveDateTime.utc_now(),
          video: video
        }

        # if abs=true in params, convert markers to abs, otherwise leave rel
        res = if Map.get(params, "abs", false) do
          Map.put(res, :markers, get_csv_markers(video_id))
        else
          Map.put(res, :markers, list_markers( video_id, syncTime ))
        end

        # if overlays=true in params, get and attach them
        res = if Map.get(params, "overlays", false),
          do: Map.put(res, :overlays, get_overlays(video_id)),
          else: res

        { :ok, res, assign(socket, :video_id, video_id) }
    end
  end

  # def handle_in("delete-overlay", %{"youtubeID" => youtubeID}, socket) do
  #   case delete_overlay(socket.assigns.video_id, youtubeID) do
  #     {:ok, _res} ->
  #       broadcast! socket, "delete_overlay", %{youtubeID: youtubeID}
  #       return_ok socket, "Overlay deleted."
  #     {:error, _changeset} ->
  #       return_error socket, "Overlay data not valid."
  #   end
  # end

  # def handle_in("set_overlay", overlay, socket) do
  #   case create_overlay(socket.assigns.video_id, overlay) do
  #     {:ok, _res} ->
  #       broadcast! socket, "set_overlay", overlay
  #       return_ok socket
  #     {:error, _changeset} ->
  #       return_error socket, "Overlay data not valid."
  #   end
  # end

  # def handle_in("remove_all_agents", _params, socket) do
  #   remove_all_markers(socket.assigns.video_id)
  #   broadcast! socket, "remove_all_agents", %{}
  #   {:noreply, socket}
  # end

  # def handle_in("remove_agent", %{"id"=>id}, socket) do
  #   case remove_agent(socket.assigns.video_id, id) do
  #     {_count, _} ->
  #       broadcast! socket, "remove_agent", %{ agent_id: id }
  #       {:noreply, socket}
  #     _ ->
  #       {:noreply, socket}
  #   end
  # end

  # def handle_in("set_marker", marker, socket) do
  #   case create_marker(socket.assigns.video_id, marker) do
  #     {:ok, marker} ->
  #       marker = Map.take(marker, ~w(id agent time x y)a)
  #       broadcast! socket, "set_marker", marker
  #       return_ok socket, marker
  #     {:error, _changeset} ->
  #       {:noreply, socket}
  #   end
  # end

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
