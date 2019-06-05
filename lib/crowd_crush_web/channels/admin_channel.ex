defmodule CrowdCrushWeb.AdminChannel do
  use CrowdCrushWeb, :channel

  def join("admin", _params, _socket) do
  #   if admin?(socket) do
  #     {now, users} = list_users(
  #       Map.get(params, :last_updated_userList, ~N[2000-01-01 10:00:00])
  #     )
  #     {:ok, %{ last_updated_userList: now, users: users }, socket}
  #   else
      {:error, %{flash: "Permission denied."}}
  #   end
  end

  # @doc """
  # Deletes multiple users
  # """
  # def handle_in("delete_users", %{"ids" => ids}, socket) do

  #   # you should not be able to modify yourself (protection)
  #   user_ids = exclude_user(ids, user_id(socket))
  #   if Enum.count(user_ids) === 0 do
  #     return_error socket, "You cannot delete your own account in this view. Please use the settings page."
  #   else
  #     case delete_users user_ids do
  #       {_count, _users} ->
  #         broadcast socket, "delete_users", %{ users: user_ids }
  #         return_ok socket
  #       nil ->
  #         return_error socket, "Something went wrong while deleting users!"
  #     end
  #   end
  # end

  # @doc """
  # Allows to change multiple users at once
  # careful: validation missing!
  # """
  # def handle_in("update_users", %{"ids" => ids, "changes" => changes}, socket) do

  #   # you should not be able to modify yourself (protection)
  #   user_ids = exclude_user(ids, user_id(socket))

  #   if Enum.count(user_ids) === 0 do
  #     return_error socket, "You cannot change your own account in this view. Please use the settings page."
  #   else
  #     now = NaiveDateTime.utc_now()
  #     case update_users(user_ids, changes) do
  #       {_count, users} ->
  #         broadcast socket, "set_users", %{
  #           last_updated_userList: now,
  #           users: render_users(users)
  #         }
  #         return_ok socket
  #       _ ->
  #         return_error socket, "Something went wrong while updating a user!"
  #     end
  #   end
  # end

  # # def handle_in("create_invitations", params, socket), do: create_invitations socket, params
  # # def handle_in("delete_invitations", params, socket), do: delete_invitations socket, params

  # @doc """
  # Locks / unlocks videos (prevents them from being edited)
  # """
  # def handle_in("update_videos", %{"ids" => ids, "changes" => changes}, socket) do
  #   now = NaiveDateTime.utc_now()
  #   case update_videos ids, changes do
  #     {_count, videos} ->
  #       Endpoint.broadcast "public", "set_videos", %{
  #         last_updated_videoList: now,
  #         videos: render_videos(videos)
  #       }
  #       return_ok socket
  #     nil ->
  #       return_error socket, "Something went wrong while updating videos!"
  #   end
  # end

  # @doc """
  # Deletes videos by a list of userIDs and broadcasts back to all users
  # """
  # def handle_in("delete_videos", %{"ids" => ids}, socket) do
  #   case delete_videos ids do
  #     {_count, _videos} ->
  #       Endpoint.broadcast "public", "delete_videos", %{ videos: ids }
  #       return_ok socket
  #     nil ->
  #       return_error socket, "Something went wrong while deleting videos!"
  #   end
  # end

  # # remove a user id from a list of user ids, if it exists in list
  # defp exclude_user(user_ids, id) do
  #   if Enum.member?(user_ids, id), do: List.delete(user_ids, id),
  #   else: user_ids
  # end
end