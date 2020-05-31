defmodule CrowdCrushWeb.AgentsLive do
  use Phoenix.LiveView

  def render(assigns), do: CrowdCrushWeb.SimView.render("agents.html", assigns)

  def mount(_params, _session, socket) do

    Process.send_after(self(), :update, 16)
    {:ok, socket
    |> assign(:time, 0)
    |> assign(:tick, 16)}
  end

  def handle_info(:update, %{assigns: %{tick: tick, time: time}} = socket) do
    Process.send_after(self(), :update, tick)
    {:noreply, assign(socket, :time, time  + 1)}
  end
end
