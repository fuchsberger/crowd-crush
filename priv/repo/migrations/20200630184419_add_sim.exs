defmodule CrowdCrush.Repo.Migrations.AddSim do
  use Ecto.Migration

  def change do
    alter table(:videos) do
      add :radius, :float
      add :max_speed, :float
      add :velocity, :float
      add :max_neighbors, :integer
      add :neighbor_dist, :float
      add :time_horizon, :float
      add :time_horizon_obst, :float
    end
  end
end
