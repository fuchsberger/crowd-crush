defmodule CrowdCrush.Simulation.Marker do
  use Ecto.Schema

  import Ecto.Changeset

  schema "markers" do
    field :agent, :integer
    field :time, :integer
    field :x, :float
    field :y, :float
    belongs_to :video, CrowdCrush.Simulation.Video
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:agent, :time, :x, :y, :video_id])
    |> validate_required([:agent, :time, :x, :y, :video_id])
    |> validate_number(:time, greater_than_or_equal_to: 0)
    |> validate_number(:x, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
    |> validate_number(:y, greater_than_or_equal_to: 0, less_than_or_equal_to: 1)
  end
end
