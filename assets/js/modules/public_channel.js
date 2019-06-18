import socket from './socket'
import { videoOperations as Video } from './video'

export default (dispatch) => {

  const channel = socket.channel('public', () => ({ last_seen: "2000-01-01T00:00:00.0" }))

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
  .receive('ok', ({ last_seen, videos }) => {
    dispatch(Video.load(videos))
    channel.params.last_seen = last_seen
  })

  return channel
}
