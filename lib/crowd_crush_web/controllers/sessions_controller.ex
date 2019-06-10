defmodule CrowdCrushWeb.SessionController do
  use CrowdCrushWeb, :controller

  alias CrowdCrushWeb.{Auth, PageView}

  # fake login controller action used after logout to  directly redirect to login
  def new(conn, _) do
    conn
    |> put_view(PageView)
    |> render "index.html"
  end

  def create(conn, %{"email" => email, "password" => pass}) do
    case Auth.login_by_email_and_pass(conn, email, pass) do
      {:ok, conn} ->
        redirect(conn, to: Routes.page_path(conn, :index))

      {:error, _reason, conn} ->
        conn
        |> put_flash(:error, "Invalid email/password combination")
        |> put_view(CrowdCrushWeb.PageView)
        |> render("index.html")
    end
  end

  def delete(conn, _) do
    conn
    |> Auth.logout()
    |> redirect(to: Routes.session_path(conn, :new))
  end
end
