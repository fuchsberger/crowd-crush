defmodule CrowdCrushWeb.Auth do
  import Plug.Conn
  import Phoenix.Controller, only: [put_view: 2, render: 2]

  alias CrowdCrush.Accounts
  require Logger
  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)

    cond do
      user = conn.assigns[:current_user] ->
        put_current_user(conn, user)

      user = user_id && Accounts.get_user(user_id) ->
        put_current_user(conn, user)

      true ->
        assign(conn, :current_user, nil)
    end
  end

  defp put_current_user(conn, user) do
    token = Phoenix.Token.sign(conn, "user_token", user.id)

    conn
    |> assign(:current_user, user)
    |> assign(:user_token, token)
  end

  def login(conn, user) do
    conn
    |> assign(:current_user, user)
    |> put_session(:user_id, user.id)
    |> configure_session(renew: true)
  end

  def logout(conn), do: configure_session(conn, drop: true)

  def authenticate_user(conn, _opts) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> put_status(401)
      |> put_view(CrowdCrushWeb.ErrorView)
      |> render("401.html")
      |> halt()
    end
  end
end
