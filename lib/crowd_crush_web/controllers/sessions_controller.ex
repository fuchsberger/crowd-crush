defmodule CrowdCrushWeb.SessionController do
  use CrowdCrushWeb, :controller

  alias CrowdCrushWeb.{Auth, PageView}

  def create(conn, %{"email" => email, "password" => pass} = params) do
    case Auth.login_by_email_and_pass(conn, email, pass) do
      {:ok, conn} ->
        if Map.has_key?(params, "redirect"),
          do: redirect(conn, to: Routes.page_path(conn, :index, redirect: params["redirect"])),
          else: redirect(conn, to: Routes.page_path(conn, :index))
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
    |> redirect(to: Routes.page_path(conn, :index, redirect: "/login"))
  end
end
