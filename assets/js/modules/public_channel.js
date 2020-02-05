import socket from './socket'
import { videoOperations as Video } from './video'

export default (dispatch) => {

  const channel = socket.channel('public')

  // Listen for events

  channel.on('add_video', ({ video }) => {
    channel.params.last_seen = video.inserted_at
    dispatch(Video.add(video))
  })

  channel.on('delete_video', ({ id }) => dispatch(Video.remove(id)))

  channel.on('modify_video', ({ video }) => {
    channel.params.last_updated = video.updated_at
    dispatch(Video.modify(video))
  })

  // channel.on('set_videos', ({ last_updated_videoList, videos }) => {
  //   channel.params.last_updated_videoList = last_updated_videoList;
  //   dispatch(loadVideos(videos))
  // });

  channel.join()

  return channel
}
