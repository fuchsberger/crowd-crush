defmodule CrowdCrushWeb.UserView do
  use CrowdCrushWeb, :view

  def render("user.json", %{user: u}) do
    %{
      id: u.id,
      username: u.username,
      inserted_at: NaiveDateTime.to_iso8601(u.inserted_at) <> "Z"
    }
  end
end
