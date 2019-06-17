import socket from './socket'
import { videoOperations as Video } from './video'

export default (dispatch) => {

  const channel = socket.channel('public')

  // Listen for events

  channel.on('add_video', ({ time, video }) => {
    channel.params.last_updated = time
    dispatch(Video.add(video))
  });

  channel.on('modify_video', ({ time, video }) => {
    channel.params.last_updated = time
    dispatch(Video.modify(video))
  });

  // channel.on('delete_videos', ({ videos }) => dispatch(removeVideos(videos)));

  // channel.on('set_videos', ({ last_updated_videoList, videos }) => {
  //   channel.params.last_updated_videoList = last_updated_videoList;
  //   dispatch(loadVideos(videos))
  // });

  channel.join()
  .receive('ok', ({ last_updated, videos }) => {
    channel.params.last_updated = last_updated
    dispatch(Video.load(videos));
  });


  return channel
}
