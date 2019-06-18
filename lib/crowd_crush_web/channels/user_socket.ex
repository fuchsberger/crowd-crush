defmodule CrowdCrushWeb.UserSocket do
  @moduledoc """
  User Socket
  """

  use Phoenix.Socket

  # Channels
  channel "public", CrowdCrushWeb.PublicChannel
  channel "private", CrowdCrushWeb.PrivateChannel
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

  @doc """
  Prints the current time (UTC) in a ISO 8601 formatted string.

  ## Examples

    CrowdCrushWeb.UserSocket.now()
    "2019-06-17T22:00:49.878834"

  """
  def now, do: NaiveDateTime.to_iso8601(NaiveDateTime.utc_now())
end
