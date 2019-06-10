defmodule CrowdCrushWeb.UserChannel do
  use CrowdCrushWeb, :channel

  alias CrowdCrush.Accounts
  alias CrowdCrushWeb.UserView

  def join("user", _params, socket) do
    case Accounts.get_user(socket.assigns.user_id) do
      user ->
        {:ok, %{ username: user.username }, socket}
      _ ->
        {:error, %{ error: "Unauthorized" }}
    end
  end

  def handle_in("update_account", %{"username" => username}, socket) do
    case Accounts.update_user(socket.assigns.user_id, %{username: username}) do
      {:ok, user } ->
        {:reply, {:ok, %{
          success: "Your username was successfully changed to: #{user.username}",
          username: user.username
        }}, assign(socket, :current_user, user)}
      _ ->
        {:reply, {:error, %{ error: "Could not update user!" }}, socket}
    end
  end

  def handle_in("update_account", %{"password" => password} = params, socket) do
    user = Accounts.get_user_with_credential(socket.assigns.user_id)
    case Pbkdf2.verify_pass(password, user.credential.password_hash) do
      true ->
        changes = Map.put(params, "password", params["new_password"])

        case Accounts.update_credential(user.credential, changes) do
          {:ok, credential } ->
            {:reply, {:ok, %{success: "You have changed your email/password." }}, socket}
          _ ->
            {:reply, {:error, %{ error: "Could not update email/password!" }}, socket}
        end
      false ->
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
