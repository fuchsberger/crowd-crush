defmodule CrowdCrushWeb.PrivateChannel do
  use CrowdCrushWeb, :channel

  alias CrowdCrush.{Accounts, Simulation}
  alias CrowdCrushWeb.VideoView

  def join("private", _params, socket) do
    case Accounts.get_user(socket.assigns.user_id) do
      nil ->
        {:error, %{ error: "Unauthorized" }}
      user ->
        {:ok, %{ username: user.username }, socket}
    end
  end

  def handle_in("change_username", username, socket) do
    case Accounts.update_user(socket.assigns.user_id, %{ username: username }) do
      {:ok, _user } ->
        return_success socket,
          "Your username was successfully changed to: #{username}",
          username: username
      _ ->
        return_error socket, "Could not update user!"
    end
  end

  def handle_in("change_email", %{"email" => email, "password" => password}, socket) do
    user = Accounts.get_user_with_credential(socket.assigns.user_id)

    if email == user.credential.email do
      {:reply, {:error, %{ info: "Your new email matches your current email address. No change was conducted." }}, socket}
    else
      case Pbkdf2.verify_pass(password, user.credential.password_hash) do
        true ->
          case Accounts.update_credential(user.credential, %{ email: email }) do
            {:ok, _credential } ->
              {:reply, {:ok, %{success: "You have changed your email." }}, socket}
            {:error, changeset} ->
              Logger.warn "#{inspect changeset}"
              {:reply, {:error, %{ error: "Could not update email!" }}, socket}
          end
        false ->
          {:reply, {:error, %{ error: "Wrong password!" }}, socket}
      end
    end
  end

  def handle_in("change_password", %{"new_password" => password, "password" => pass}, socket) do
    user = Accounts.get_user_with_credential(socket.assigns.user_id)
    case Pbkdf2.verify_pass(pass, user.credential.password_hash) do
      true ->
        case Accounts.update_credential(user.credential, %{ password: password }) do
          {:ok, _credential } ->
            {:reply, {:ok, %{success: "You have changed your password." }}, socket}
          _ ->
            {:reply, {:error, %{ error: "Could not update password!" }}, socket}
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
