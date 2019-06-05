defmodule CrowdCrush.Simulations.Overlay do
  use CrowdCrush, :schema

  @primary_key {:id, CrowdCrush.Permalink, autogenerate: true}

  schema "overlays" do
    field :title, :string
    field :youtubeID, :string
    timestamps()
    belongs_to :video, CrowdCrush.Simulations.Video
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :youtubeID, :video_id])
    |> validate_required([:youtubeID, :title, :video_id])
  end
end
