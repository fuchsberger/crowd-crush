defmodule CrowdCrushWeb.UserSocket do

  use Phoenix.Socket

  # Channels
  channel "public", CrowdCrushWeb.PublicChannel
  channel "user", CrowdCrushWeb.UserChannel
  channel "sim:*", CrowdCrushWeb.SimChannel

  # Users or users with expired/invalid token join as anonymous users.
  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, "user_token", token, max_age: 86400) do
      {:ok, user_id} ->
        {:ok, assign(socket, :user_id, user_id)}
      {:error, _reason} ->
        {:ok, assign(socket, :user_id, nil)}
    end
  end

  def id(socket), do: "users_socket:#{socket.assigns.user_id}"
end
