defmodule CrowdCrushWeb.SessionsView do
  use CrowdCrushWeb, :view

  def render("show.json", %{user: u, user_token: token}) do
    %{username: u.username, user_token: token}
  end

  def render("error.json", _) do
    %{error: "Invalid email or password"}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end
end
