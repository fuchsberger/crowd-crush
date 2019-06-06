defmodule CrowdCrush.Repo.Migrations.Initialize do
  use Ecto.Migration

  def change do

    create table(:users) do
      add :name, :string
      add :username, :string, null: false
      timestamps()
    end

    create unique_index(:users, [:username])

    create table(:credentials) do
      add :email, :string, null: false
      add :password_hash, :string, null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      timestamps()
    end

    create unique_index(:credentials, [:email])
    create index(:credentials, [:user_id])

    create table(:videos) do
      add :aspectratio, :float, null: false
      add :title, :string, null: false
      add :youtubeID, :string, null: false
      add :m0_x, :float, default: 0.45, null: false
      add :m0_y, :float, default: 0.45, null: false
      add :mX_x, :float, default: 0.54, null: false
      add :mX_y, :float, default: 0.45, null: false
      add :mY_x, :float, default: 0.44, null: false
      add :mY_y, :float, default: 0.55, null: false
      add :mR_x, :float, default: 0.55, null: false
      add :mR_y, :float, default: 0.55, null: false
      add :dist_x, :float, default: 2, null: false
      add :dist_y, :float, default: 2, null: false
      timestamps()
    end
    create unique_index(:videos, [:youtubeID])

    create table(:markers) do
      add :agent, :integer, null: false
      add :time,  :integer, null: false
      add :x, :float, null: false
      add :y, :float, null: false
      add :video_id, references(:videos, on_delete: :delete_all)
      timestamps()
    end
    create index(:markers, [:video_id])

    create table(:overlays) do
      add :title, :string, null: false
      add :youtubeID, :string, null: false
      add :video_id, references(:videos, on_delete: :delete_all)
      timestamps()
    end
    create index(:overlays, [:video_id])
  end
end
