defmodule CrowdCrushWeb.CanvasLive do
  use Phoenix.LiveView

  @particles 250
  @da -0.005
  @ax 0
  @ay 0.00025

  def render(assigns), do: CrowdCrushWeb.TestView.render("canvas.html", assigns)

  def mount(_params, _session, socket) do
    particles = for _x <- 1..@particles, do: create_particle()
    Process.send_after(self(), :update, 16)
    {:ok, socket
    |> assign(:particles, particles)
    |> assign(:tick, 16)}
  end

  def handle_event("updates_per_second", %{"value" => value}, socket) do
    {tick, ""} = Integer.parse(value)
    {:noreply, assign(socket, :tick, tick)}
  end

  def handle_info(:update, %{assigns: %{particles: particles, tick: tick}} = socket) do
    Process.send_after(self(), :update, tick)
    {:noreply, assign(socket, :particles, Enum.map(particles, &update_particle/1))}
  end

  defp create_particle do
    [
      :rand.uniform(), # a
      0.0, # x
      0.0, # y
      (:rand.uniform() - 0.5)/20, # vx
      (:rand.uniform() - 0.5)/20, # vy
    ]
  end

  defp update_particle([a, x, y, vx, vy] = _particle) do
    if (a + @da < 0) do
      create_particle()
    else
      [
        a + @da,
        x + vx,
        y + vy,
        vx + @ax,
        vy + @ay
      ]
    end
  end
end
