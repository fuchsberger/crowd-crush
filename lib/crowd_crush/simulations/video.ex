defmodule CrowdCrush.Simulations.Video do
  use CrowdCrush, :schema

  schema "videos" do
    field :aspectratio, :float
    field :duration, :integer
    field :title, :string
    field :youtubeID, :string
    field :m0_x, :float, default: 0.8
    field :m0_y, :float, default: 0.8
    field :mX_x, :float, default: 0.9
    field :mX_y, :float, default: 0.8
    field :mY_x, :float, default: 0.8
    field :mY_y, :float, default: 0.9
    field :mR_x, :float, default: 0.9
    field :mR_y, :float, default: 0.9
    field :dist_x, :float
    field :dist_y, :float
    has_many :markers, CrowdCrush.Simulations.Marker
    has_many :overlays, CrowdCrush.Simulations.Overlay
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params) do
    struct
    |> cast(params, ~w(aspectratio duration title youtubeID m0_x m0_y mX_x mX_y mY_x mY_y mR_x mR_y dist_x dist_y)a)
    |> validate_required([:aspectratio, :duration, :title, :youtubeID])
    |> validate_format(:title, ~r/^[^<>]*$/)
    |> validate_length(:title, min: 5, max: 100)
    |> validate_number(:duration, greater_than: 0)
    |> validate_number(:m0_x, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:m0_y, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:mX_x, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:mX_y, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:mY_x, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:mY_y, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:mR_x, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:mR_y, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:dist_x, greater_than: 0)
    |> validate_number(:dist_y, greater_than: 0)
    |> unique_constraint(:youtubeID)
  end
end
