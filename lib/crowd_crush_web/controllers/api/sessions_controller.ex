defmodule CrowdCrushWeb.SessionsController do
  use Phoenix.Controller

  import CrowdCrushWeb.Auth

  plug :scrub_params, "session" when action in [:create]

  def create(conn, %{"session" => session_params}) do
    case authenticate(conn, session_params) do
      {:ok, user, jwt} ->
        conn
        |> put_status(:created)
        |> render("show.json", jwt: jwt, user: user)
      :error ->
        conn
        |> put_status(:unprocessable_entity)
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
