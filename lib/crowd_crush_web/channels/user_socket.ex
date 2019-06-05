defmodule CrowdCrushWeb.UserSocket do

  use Phoenix.Socket
  import CrowdCrush.Accounts, only: [get_user: 1]
  import CrowdCrushWeb.Auth, only: [salt: 0]

  # Channels
  channel "public", CrowdCrushWeb.PublicChannel
  channel "user", CrowdCrushWeb.UserChannel
  channel "sim:*", CrowdCrushWeb.SimChannel

  # returning error forces client to delete invalid token and retry anonymously
  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, salt(), token, max_age: 86400) do
      {:ok, user_id} ->
        case get_user(user_id) do
          nil  -> :error
          user -> {:ok, assign(socket, :current_user, user)}
        end
      {:error, _reason} ->
        :error
    end
  end

  def connect(_params, socket), do: {:ok, socket}

  def id(socket) do
    if Map.has_key?(socket.assigns, :current_user),
      do: "user:#{socket.assigns.current_user.id}",
      else: nil
  end
end
