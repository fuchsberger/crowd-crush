defmodule CrowdCrush.Repo.Migrations.CreateObstacles do
  use Ecto.Migration

  def change do
    create table("obstacles") do
      add :a_x, :float
      add :a_y, :float
      add :b_x, :float
      add :b_y, :float
      add :video_id, references(:videos, on_delete: :delete_all)
      timestamps()
    end

    create index(:obstacles, [:video_id])
  end
end
