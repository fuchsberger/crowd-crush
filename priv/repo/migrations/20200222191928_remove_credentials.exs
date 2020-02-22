defmodule CrowdCrush.Repo.Migrations.RemoveCredentials do
  use Ecto.Migration

  def change do
    drop table("credentials")
    drop table("users")

    create table(:users) do
      add :username, :string, null: false
      add :password_hash, :string
      timestamps()
    end

    create unique_index(:users, [:username])
  end
end
