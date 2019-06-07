defmodule CrowdCrushWeb.Auth do
  import Plug.Conn

  alias CrowdCrush.Accounts

  require Logger

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)
    user = user_id && Accounts.get_user(user_id)
    assign(conn, :current_user, user)
  end

  def login(conn, user) do
    conn
    |> put_current_user(user)
    |> put_session(:user_id, user.id)
    |> configure_session(renew: true)
  end

  defp put_current_user(conn, user) do
    token = Phoenix.Token.sign(conn, "user_token", user.id)
    Logger.warn "Token produced: #{inspect token}"
    conn
    |> assign(:current_user, user)
    |> assign(:user_token, token)
  end

  def logout(conn), do: configure_session(conn, drop: true)

  def login_by_email_and_pass(conn, email, given_pass) do
    case Accounts.authenticate_by_email_and_pass(email, given_pass) do
      {:ok, user} -> {:ok, login(conn, user)}
      {:error, :unauthorized} -> {:error, :unauthorized, conn}
      {:error, :not_found} -> {:error, :not_found, conn}
    end
  end

  # def authenticate(conn, %{"email" => e, "password" => p}) do
  #   case Accounts.get_user_by_email(e) do
  #     nil ->
  #       :error
  #     user ->
  #       case Accounts.validate_password(user, p) do
  #         true ->
  #           {:ok, user, Phoenix.Token.sign(conn, salt(), user.id)}
  #         _ ->
  #           :error
  #       end
  #   end
  # end

  # def salt() do
  #   :crowd_crush
  #   |> Application.get_env(CrowdCrushWeb.Endpoint)
  #   |> Keyword.fetch!(:secret_key_base)
  # end
end
