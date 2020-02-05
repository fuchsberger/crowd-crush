defmodule CrowdCrushWeb.PublicChannel do
  use CrowdCrushWeb, :channel

  alias Phoenix.View
  alias CrowdCrushWeb.VideoView

  def join("public", _params, socket), do: {:ok, socket}

  def handle_in("load_videos", _params, socket) do
    {:reply, {:ok, %{ videos: Simulation.list_videos() }}, socket}
  end
end
