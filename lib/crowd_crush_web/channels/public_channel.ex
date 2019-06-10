defmodule CrowdCrushWeb.PublicChannel do
  use CrowdCrushWeb, :channel
  import CrowdCrush.Simulation

  def join("public", params, socket) do
    # Logger.warn "#{inspect params}"
    last_updated = Map.get(params, :last_updated, ~N[2000-01-01 10:00:00])
    {now, videos} = list_videos(last_updated)

    params = %{
      last_updated: now,
      videos: videos
    }
    {:ok, params, socket}
  end
end
