defmodule CrowdCrushWeb.PrivateChannel do
  use CrowdCrushWeb, :channel

  alias CrowdCrush.Accounts
  alias CrowdCrushWeb.VideoView

  def join("private", _params, socket) do
    case Accounts.get_user(socket.assigns.user_id) do
      nil -> {:error, %{ error: "Unauthorized" }}
      user -> {:ok, %{ username: user.username }, socket}
    end
  end

  def handle_in("create_video", params, socket) do
    case Simulation.create_video(params) do
      {:ok, video} ->
        Endpoint.broadcast "public", "add_video",
          %{ video: View.render_one(video, VideoView, "video.json")}

        return_success socket, "The video was successfully added to the database."

      {:error, changeset} ->
        if Keyword.has_key?(changeset.errors, :youtubeID),
          do: return_error(socket, "This video is already in the database."),
          else: return_error(socket,"Something went wrong. Please check your form fields.")
    end
  end

  def handle_in("update_video:" <> video_id, video_params, socket) do
    video = Simulation.get_video!(video_id)

    case Simulation.update_video(video, video_params) do
      {:ok, video} ->
        Endpoint.broadcast "public", "modify_video",
          %{ video: View.render_one(video, VideoView, "video.json") }

        return_success socket, "The video was successfully updated."

      {:error, _changeset} ->
        return_error socket, "Could not update video in database."
    end
  end

  def handle_in("delete_video:" <> video_id, _params, socket) do
    video = Simulation.get_video!(video_id)

    case Simulation.delete_video(video) do
      {:ok, _video} ->
        Endpoint.broadcast "public", "delete_video", %{ id: video_id }
        return_success socket, "The video was successfully deleted."

      {:error, _changeset} ->
        return_error socket, "Could not update video in database."
    end
  end
end
