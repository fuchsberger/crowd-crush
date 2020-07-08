defmodule CrowdCrush.Simulation.Obstacle do
  use Ecto.Schema

  import Ecto.Changeset

  schema "obstacles" do
    field :a_x, :float
    field :a_y, :float
    field :b_x, :float
    field :b_y, :float
    timestamps()
    belongs_to :video, CrowdCrush.Simulation.Video
  end

  @required_fields [:a_x, :a_y, :b_x, :b_y, :video_id]

  def changeset(overlay, attrs) do
    overlay
    |> cast(attrs, @required_fields)
    |> validate_required(@required_fields)
    |> validate_number(:a_x, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:a_y, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:b_x, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:b_y, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> foreign_key_constraint(:video_id)
  end
end
