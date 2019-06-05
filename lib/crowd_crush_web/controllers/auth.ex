defmodule CrowdCrushWeb.Auth do
  import Plug.Conn
  import CrowdCrush.Accounts

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)
    user = user_id && get_user(user_id)
    assign(conn, :current_user, user)
  end

  def authenticate(conn, %{"email" => e, "password" => p}) do
    case get_user_by_email(e) do
      nil ->
        :error
      user ->
        case validate_password(user, p) do
          true ->
            {:ok, user, Phoenix.Token.sign(conn, salt(), user.id)}
          _ ->
            :error
        end
    end
  end

  def salt() do
    :crowd_crush
    |> Application.get_env(CrowdCrushWeb.Endpoint)
    |> Keyword.fetch!(:secret_key_base)
  end
end