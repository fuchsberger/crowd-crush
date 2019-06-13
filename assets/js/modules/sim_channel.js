/**
 * Configures and returns simulation channel.
 * Also subscribes to channel events and dispatches actions accordingly.
 * @param {{}} socket
 * @param { function } dispatch
 * @param { number } video_id
 * @param { boolean } overlays should channel load overlays
 */
const configSimChannel = ( socket, dispatch, video_id, params ) => {
  const channel = socket.channel(`sim:${video_id}`, params );

  if(params.overlays){
  // channel.on('delete_overlay', overlay =>
  //   dispatch({
  //     type: DELETE_OVERLAY,
  //     youtubeID: overlay.youtubeID
  //   })
  // );

  // channel.on('set_overlay', overlay =>
  //   dispatch({ type: SET_OVERLAY, overlay })
  // );
  }


  // // listen for new/updated markers
  // channel.on('set_marker', marker =>
  //   dispatch({ type: SET_MARKER, marker }));

  // channel.on('remove_agent', res =>
  //   dispatch({ type: DELETE_AGENT, ...res })
  // );

  // channel.on('remove_all_agents', () =>
  //   dispatch({ type: DELETE_ALL_AGENTS })
  // );

  return channel;
}
