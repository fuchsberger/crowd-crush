# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :crowd_crush,
  ecto_repos: [CrowdCrush.Repo],
  youtube_api_key: System.get_env("YOUTUBE_DATA_API_KEY")

# Configures the endpoint
config :crowd_crush, CrowdCrushWeb.Endpoint,
  live_view: [signing_salt: "UkYSpPhc21dBoIlVS3mRzKTZ4z1PcGDa"],
  url: [host: "localhost"],
  secret_key_base: "L2gUqlkhyHjMBx2ARefpXbQ81cdr00NRtdrelH8v35A5/VQbFm9VxKm0GKufNoWo",
  render_errors: [view: CrowdCrushWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: CrowdCrush.PubSub

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
