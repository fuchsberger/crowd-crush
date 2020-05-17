defmodule CrowdCrush.Simulation.Overlay do
  use Ecto.Schema

  import Ecto.Changeset

  schema "overlays" do
    field :title, :string
    field :youtubeID, :string
    timestamps()
    belongs_to :video, CrowdCrush.Simulation.Video
  end

  def changeset(overlay, attrs) do
    overlay
    |> cast(attrs, [:title, :youtubeID])
    |> validate_required([:title, :youtubeID])
  end
end
