defmodule CrowdCrushWeb.ExportController do
  use Phoenix.Controller

  import CrowdCrush.Simulation, only: [get_csv_markers: 1, get_csv_agents: 1]

  # Exports all annotated markers in the format [agent_id, time, x, y]
  def export_csv(conn, %{"id" => video_id}) do
    markers = video_id
    |> get_csv_markers
    |> CSV.encode
    |> Enum.to_list
    |> to_string

    conn
    |> put_resp_content_type("text/csv")
    |> put_resp_header("content-disposition", "attachment; filename=\"#{video_id}.csv\"")
    |> send_resp(200, markers)
  end

  # Exports agents in the format:
  # [start_time, start_x, start_y, end_time, end_x, end_y]
  def export_eclipse(conn, %{"id" => video_id}) do
    agents = video_id
    |> get_csv_markers
    |> get_csv_agents
    |> CSV.encode
    |> Enum.to_list
    |> to_string

    conn
    |> put_resp_content_type("text/csv")
    |> put_resp_header("content-disposition", "attachment; filename=\"#{video_id}.csv\"")
    |> send_resp(200, agents)
  end

  def export_json(conn, %{"id" => video_id}) do
    json conn, %{
      video_id: video_id,
      markers: get_csv_markers(video_id)
    }
  end
end
