defmodule CrowdCrush.Repo.Migrations.AddVideoDuration do
  use Ecto.Migration

  def change do
    alter table(:videos) do
      add :duration, :integer
    end

    execute "UPDATE videos SET duration=120"

    alter table(:videos) do
      modify :duration, :integer, null: false
    end
  end
end
