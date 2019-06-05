defmodule CrowdCrushWeb.UserView do
  use CrowdCrushWeb, :view

  def render("me.json", user) do
    %{
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }
  end

  def render("user.json", %{user: u}) do
    %{
      id: u.id,
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      inserted_at: NaiveDateTime.to_iso8601(u.inserted_at) <> "Z"
    }
  end
end