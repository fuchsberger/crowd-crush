defmodule CrowdCrush.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do

    # Define workers and child supervisors to be supervised
    children = [
      # Start the PubSub system
      {Phoenix.PubSub, name: CrowdCrush.PubSub},
      # Start the Ecto repository
      CrowdCrush.Repo,
      # Start the endpoint when the application starts
      CrowdCrushWeb.Endpoint,
      # Start your own worker by calling: CrowdCrush.Worker.start_link(arg1, arg2, arg3)
      # worker(CrowdCrush.Worker, [arg1, arg2, arg3]),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: CrowdCrush.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    CrowdCrushWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
