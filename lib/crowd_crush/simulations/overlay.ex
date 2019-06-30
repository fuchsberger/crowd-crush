defmodule CrowdCrush.Simulations.Overlay do
  use CrowdCrush, :schema

  @primary_key {:id, CrowdCrush.Permalink, autogenerate: true}

  schema "overlays" do
    field :title, :string
    field :youtubeID, :string
    timestamps()
    belongs_to :video, CrowdCrush.Simulations.Video
  end

  def changeset(overlay, attrs) do
    overlay
    |> cast(attrs, [:title, :youtubeID])
    |> validate_required([:title, :youtubeID])
  end
end
