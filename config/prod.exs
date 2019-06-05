use Mix.Config

# Do not print debug messages in production
config :logger, level: :info

config :crowd_crush, CrowdCrushWeb.Endpoint,
  http: [port: 4002],
  url:  [scheme: "https", host: "crowd.fuchsberger.us", port: 443],
  cache_static_manifest: "priv/static/cache_manifest.json",
  code_reloader: false,
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  server: true

config :crowd_crush, CrowdCrush.Repo,
  hostname: System.get_env("DB_HOSTNAME"),
  username: System.get_env("DB_USERNAME"),
  password: System.get_env("DB_PASSWORD"),
  database: "crowd_crush_prod",
  pool_size: 1

config :phoenix, :serve_endpoints, true
