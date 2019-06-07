defmodule CrowdCrushWeb.SessionsController do
  use Phoenix.Controller

  def create(conn, %{"session" => %{"email" => email, "password" => pass}}) do
    case CrowdCrushWeb.Auth.login_by_email_and_pass(conn, email, pass) do
      {:ok, conn} ->

        render conn, "show.json",
          user: conn.assigns.current_user,
          user_token: conn.assigns.user_token

      {:error, _reason, conn } ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")
    end
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(CrowdCrushWeb.SessionsView, "forbidden.json",
        error: "Not Authenticated!")
  end
end
