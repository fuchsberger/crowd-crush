use Mix.Config

# expose enviroment to enable react debugging
config :crowd_crush, :environment, :test

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :crowd_crush, CrowdCrushWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :crowd_crush, CrowdCrush.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgresql",
  database: "crowd_crush_test",
  hostname: "localhost",
  template: "template0",
  pool: Ecto.Adapters.SQL.Sandbox
