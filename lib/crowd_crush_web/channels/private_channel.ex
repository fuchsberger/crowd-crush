# Private Channel (authentication required)

defmodule CrowdCrushWeb.PrivateChannel do
  use CrowdCrushWeb, :channel

  def join("private", _params, _socket) do
    # if user?(socket), do: {:ok, session(user_id(socket)), socket},
    # else: 
    {:error,  %{flash: "Unauthorized."}}
  end

  # def handle_in("add_video", params, socket) do
  #   now = NaiveDateTime.utc_now()
  #   case add_video(params) do
  #     {:ok, video} ->
  #       broadcast socket, "set_videos", %{
  #         last_updated_videoList: now,
  #         videos: render_videos([video])
  #       }
  #       return_ok socket
  #     {:error, changeset} ->
  #       error = if Keyword.has_key?(changeset.errors, :youtubeID),
  #         do:   "This video is already in the database.",
  #         else: "Something went wrong. Please check your form fields."
  #       return_error socket, error
  #   end
  # end
end