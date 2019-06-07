defmodule CrowdCrushWeb.UserChannel do
  use CrowdCrushWeb, :channel
  import CrowdCrush.Accounts

  alias CrowdCrushWeb.UserView

  def join("user", _params, socket) do
    if Map.has_key?(socket.assigns, :current_user) do
      user = View.render(UserView, "user.json", user: socket.assigns.current_user)
      {:ok, %{user: user}, socket}
    else
      {:error, %{ error: "Unauthorized." }}
    end
  end

  def handle_in("update_account", params, socket) do
    case validate_password(socket.assigns.current_user, params["password"]) do
      true ->
        changes =
          params
          |> Map.put("password", params["new_password"])
          |> Map.delete("new_password")

        case update_user(socket.assigns.current_user, changes) do
          {:ok, user } ->
            { :reply,
              {:ok, %{user: Phoenix.View.render(UserView, "user.json", user: user)}},
              assign(socket, :current_user, user)
            }
          _ ->
            {:reply, {:error, %{ error: "Could not update user!" }}, socket}
        end
      _ ->
        {:reply, {:error, %{ error: "Wrong password!" }}, socket}
    end
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
