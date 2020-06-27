# defmodule CrowdCrushWeb.SimChannel do

#   use CrowdCrushWeb, :channel

#   alias CrowdCrush.Simulation
#   alias CrowdCrushWeb.OverlayView

#   def handle_in("create_overlay", overlay_params, socket) do

#     video = Simulation.get_video!(socket.assigns.video_id)

#     case Simulation.create_overlay(video, overlay_params) do
#       {:ok, overlay} ->
#         broadcast! socket, "add_overlay", View.render_one(overlay, OverlayView, "overlay.json")
#         return_success socket

#       {:error, _changeset} ->
#         return_error socket
#     end
#   end

#   def handle_in("delete_overlay:" <> overlay_id, _params, socket) do
#     overlay = Simulation.get_overlay!(overlay_id)

#     case Simulation.delete_overlay(overlay) do
#       {:ok, _overlay} ->
#         broadcast! socket, "remove_overlay", %{ id: overlay.id }
#         return_success socket

#       {:error, _changeset} ->
#         return_error socket
#     end
#   end
# end
