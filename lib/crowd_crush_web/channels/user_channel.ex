defmodule CrowdCrushWeb.UserChannel do
  use CrowdCrushWeb, :channel

  alias CrowdCrush.{Accounts, Simulation}
  alias CrowdCrushWeb.VideoView

  def join("user", _params, socket) do
    case Accounts.get_user(socket.assigns.user_id) do
      nil ->
        {:error, %{ error: "Unauthorized" }}
      user ->
        {:ok, %{ username: user.username }, socket}
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
          {:ok, _credential } ->
            {:reply, {:ok, %{success: "You have changed your email/password." }}, socket}
          _ ->
            {:reply, {:error, %{ error: "Could not update email/password!" }}, socket}
        end
      false ->
        {:reply, {:error, %{ error: "Wrong password!" }}, socket}
      end
  end

  def handle_in("add_video", params, socket) do
    now = NaiveDateTime.utc_now()
    case Simulation.create_video(params) do
      {:ok, video} ->
        broadcast socket, "add_video", %{
          time: now,
          video: View.render_one(video, VideoView, "video.json")
        }
        return_success socket, "The video was successfully added to the database."

      {:error, changeset} ->
        if Keyword.has_key?(changeset.errors, :youtubeID),
          do: return_error(socket, "This video is already in the database."),
          else: return_error(socket,"Something went wrong. Please check your form fields.")
    end
  end
end
