defmodule CrowdCrushWeb.SessionController do
  use CrowdCrushWeb, :controller

  alias CrowdCrushWeb.{Auth, PageView}

  def create(conn, %{"email" => email, "password" => pass} = params) do

    # check if user should be redirected after login
    redirect_path = Map.get(params, "redirect", false)

    case Auth.login_by_email_and_pass(conn, email, pass) do
      {:ok, conn} ->
        if redirect_path do
          redirect(conn, to: Routes.page_path(conn, :index, redirect: redirect_path))
        else
          redirect(conn, to: Routes.page_path(conn, :index))
        end
      {:error, _reason, conn} ->
        conn
        |> assign(:redirect, redirect_path)
        |> put_flash(:error, "Invalid email/password combination")
        |> put_view(PageView)
        |> render("index.html")
    end
  end

  def delete(conn, _) do
    conn
    |> Auth.logout()
    |> redirect(to: Routes.page_path(conn, :index, redirect: "/login"))
  end
end
