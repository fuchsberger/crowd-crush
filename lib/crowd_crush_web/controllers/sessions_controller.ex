defmodule CrowdCrushWeb.SessionController do
  use CrowdCrushWeb, :controller

  alias CrowdCrushWeb.Auth

  def new(conn, _), do: render(conn, "new.html")

  def create(conn, %{"session" =>  %{"username" => username, "password" => pass}}) do
    case CrowdCrush.Accounts.authenticate_by_username_and_pass(username, pass) do
      {:ok, user} ->
        conn
        |> Auth.login(user)
        |> redirect(to: Routes.page_path(conn, :index))

      {:error, _reason} ->
        conn
        |> put_flash(:error, "Invalid username/password combination")
        |> render("new.html")
    end
  end

  def delete(conn, _) do
    conn
    |> Auth.logout()
    |> redirect(to: Routes.page_path(conn, :index))
  end
end
