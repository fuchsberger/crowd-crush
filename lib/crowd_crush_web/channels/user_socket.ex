defmodule CrowdCrushWeb.UserSocket do

  use Phoenix.Socket

  alias CrowdCrush.Accounts

  # Channels
  channel "public", CrowdCrushWeb.PublicChannel
  channel "user", CrowdCrushWeb.UserChannel
  channel "sim:*", CrowdCrushWeb.SimChannel

  # returning error forces client to delete invalid token and retry anonymously
  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, "user_token", token, max_age: 86400) do
      {:ok, user_id} ->
        case Accounts.get_user(user_id) do
          nil  -> :error
          user -> {:ok, assign(socket, :current_user, user)}
        end
      {:error, reason} ->
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
