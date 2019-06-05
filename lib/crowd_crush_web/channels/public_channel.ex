defmodule CrowdCrushWeb.PublicChannel do
  use CrowdCrushWeb, :channel
  import CrowdCrush.Simulation

  def join("public", params, socket) do
    syncTime = Map.get(params, :syncTime, ~N[2000-01-01 10:00:00])
    {now, videos} = list_videos(syncTime)

    params = %{
      syncTime: now,
      videos: videos
    }
    {:ok, params, socket}
  end
end
