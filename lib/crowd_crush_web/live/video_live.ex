defmodule CrowdCrushWeb.VideoLive do
  use Phoenix.LiveView
  use Phoenix.HTML

  alias CrowdCrush.Simulation
  alias CrowdCrush.Simulation.Video

  @key Application.get_env(:crowd_crush, :youtube_api_key)

  def render(assigns), do: CrowdCrushWeb.VideoView.render("index.html", assigns)

  def mount(_params, session, socket), do:
    {:ok, assign(socket, %{
      authenticated?: Map.has_key?(session, "user_id"),
      changeset: nil,
      videos: Simulation.list_videos()
    })}

  # changing url on new videos
  def handle_event("validate", %{"video" => %{"url" => url} = params}, socket) do
    changeset = Simulation.change_video(%Video{}, params)
    if Keyword.has_key?(changeset.errors, :url) do
      {:noreply, assign(socket, changeset: changeset)}
    else
      [_, params] = String.split(url, "?")
      %{"v" => youtubeID} = URI.decode_query(params)

      api_url = "https://www.googleapis.com/youtube/v3/videos?&id=#{youtubeID}&key=#{@key}&part=snippet,player,contentDetails&maxHeight=8192"

      case HTTPoison.get(api_url) do
        {:ok, response} ->
          video = response.body |> Jason.decode!() |> Map.get("items") |> List.first()

          params = %{
            aspectratio:
              String.to_integer(video["player"]["embedWidth"]) /
              String.to_integer(video["player"]["embedHeight"]),
            duration: iso8601_to_sec(video["contentDetails"]["duration"]),
            title: video["snippet"]["title"],
            youtubeID: video["id"]
          }
          changeset = Simulation.change_video(%Video{}, params) |> Map.put(:action, :insert)

          {:noreply, assign(socket, changeset: changeset)}

        {:error, %HTTPoison.Error{reason: _reason}} ->
          {:noreply, assign(socket, changeset: changeset)}
      end
    end
  end

  def handle_event("validate", %{"video" => params}, socket), do:
    {:noreply, assign(socket,
      changeset: Simulation.change_video(socket.assigns.changeset.data, params)
    )}

  def handle_event("add", _params, socket),
    do: {:noreply, assign(socket, changeset: Simulation.change_video(%Video{}, %{}))}

  def handle_event("edit", %{"id" => id}, socket) do
    video = Enum.find(socket.assigns.videos, & &1.id == String.to_integer(id))
    {:noreply, assign(socket, changeset: Simulation.change_video(video, %{}))}
  end

  def handle_event("cancel", _params, socket),
    do: {:noreply, assign(socket, changeset: nil)}

  def handle_event("create", %{"video" => params}, socket) do
    case Simulation.create_video(params) do
      {:ok, _video } ->
        {:noreply, assign(socket, changeset: nil, videos: Simulation.list_videos())}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end

  def handle_event("update", %{"video" => params}, socket) do
    case Simulation.update_video(socket.assigns.changeset.data, params) do
      {:ok, _video } ->
        {:noreply, assign(socket, changeset: nil, videos: Simulation.list_videos())}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end

  def handle_event("delete", %{"id" => id}, socket) do
    case Simulation.delete_video(id) do
      {:ok, _video } -> {:noreply, assign(socket, videos: Simulation.list_videos())}
      {:error, %Ecto.Changeset{} = _changeset} -> {:noreply, socket}
    end
  end

  defp iso8601_to_sec(str) do
    case String.split(str, ["PT", "H", "M", "S"], trim: true) do
      [h, m, s] -> 60*60*String.to_integer(h) + 60*String.to_integer(m) + String.to_integer(s)
      [m, s] -> 60*String.to_integer(m) + String.to_integer(s)
      [s] -> String.to_integer(s)
    end
  end
end
