defmodule CrowdCrush.Repo do
  use Ecto.Repo,
    otp_app: :crowd_crush,
    adapter: Ecto.Adapters.Postgres
end
