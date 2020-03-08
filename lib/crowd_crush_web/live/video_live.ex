defmodule CrowdCrushWeb.VideoLive do
  use Phoenix.LiveView
  use Phoenix.HTML

  alias CrowdCrush.Simulation
  alias CrowdCrush.Simulation.Video
  alias CrowdCrushWeb.Router.Helpers, as: Routes

  @key Application.get_env(:crowd_crush, :youtube_api_key)

  def render(assigns), do: CrowdCrushWeb.VideoView.render("form.html", assigns)

  def mount(_params, _session, socket) do
    {:ok, assign(socket, %{changeset: Simulation.change_video(%Video{}, %{})})}
  end

  def handle_event("validate", %{"video" => video_params}, socket) do

    changeset =
      %Video{}
      |> Simulation.change_video(video_params)


    if Keyword.has_key?(changeset.errors, :url) do
      {:noreply, assign(socket, changeset: changeset)}
    else
      # if data has not been fetched yet do so now
      if is_nil(Ecto.Changeset.get_change(changeset, :youtubeID)) do
        [_, params] = Ecto.Changeset.get_change(changeset, :url) |> String.split("?")
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
              url: video_params["url"],
              youtubeID: video["id"]
            }

            changeset =
              %Video{}
              |> Simulation.change_video(params)
              |> Map.put(:action, :insert)

            {:noreply, assign(socket, changeset: changeset)}

          {:error, %HTTPoison.Error{reason: reason}} ->
            {:noreply, assign(socket, changeset: changeset)}
        end
      else
        {:noreply, assign(socket, changeset: Simulation.change_video(%Video{}, video_params))}
      end
    end
  end

  defp iso8601_to_sec(str) do
    case String.split(str, ["PT", "H", "M", "S"], trim: true) do
      [h, m, s] -> 60*60*String.to_integer(h) + 60*String.to_integer(m) + String.to_integer(s)
      [m, s] -> 60*String.to_integer(m) + String.to_integer(s)
      [s] -> String.to_integer(s)
    end
  end

  def handle_event("create", %{"video" => params}, socket) do
    case Simulation.create_video(params) do
      {:ok, _video } ->
        {:noreply, redirect(socket, to: Routes.video_path(socket, :index))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end

end
