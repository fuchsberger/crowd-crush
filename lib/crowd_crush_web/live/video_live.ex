defmodule CrowdCrushWeb.VideoLive do
  use Phoenix.LiveView
  use Phoenix.HTML

  alias CrowdCrush.Simulation
  alias CrowdCrush.Simulation.Video

  def render(assigns), do: CrowdCrushWeb.VideoView.render("form.html", assigns)

  def mount(_params, _session, socket) do
    {:ok, assign(socket, %{changeset: Simulation.change_video(%Video{}, %{})})}
  end

  def handle_event("validate", %{"video" => params}, socket) do

    changeset =
      %Video{}
      |> Simulation.change_video(params)
      |> Map.put(:action, :insert)

    if Keyword.has_key?(changeset.errors, :url) do
      {:noreply, assign(socket, changeset: changeset)}
    else
      # if data has not been fetched yet do so now
      if is_nil(Ecto.Changeset.get_change(changeset, :youtubeID)) do
        [_, params] = Ecto.Changeset.get_change(changeset, :url) |> String.split("?")
        %{"v" => youtubeID} = URI.decode_query(params)

        api_url = "https://www.googleapis.com/youtube/v3/videos?&id=#{youtubeID}&key=#{Application.get_env(:crowd_crush, :youtube_api_key)}&part=snippet,player,contentDetails&maxHeight=8192"

        case HTTPoison.get(api_url) do
          {:ok, response} ->
            response = Jason.decode!(response.body)
            video = List.first(response["items"])

            params = %{
              aspectratio:
                String.to_integer(video["player"]["embedWidth"]) /
                String.to_integer(video["player"]["embedHeight"]),
              duration: video["contentDetails"]["duration"],
              title: video["snippet"]["title"],
              youtubeID: video["id"]
            }

            changeset =
              %Video{}
              |> Simulation.change_video(params)
              |> Map.put(:action, :insert)

            # IO.inspect changeset

            {:noreply, assign(socket, changeset: changeset)}

          {:error, %HTTPoison.Error{reason: reason}} ->
            IO.inspect reason
            {:noreply, assign(socket, changeset: changeset)}
        end
      else
        {:noreply, assign(socket, changeset: changeset)}
      end
    end
  end
end
