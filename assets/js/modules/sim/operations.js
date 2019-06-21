import socket from '../socket'
// import { Api } from "../../utils"
import { REFRESH_INTERVAL } from '../../config'
import actions from "./actions"
import { flashOperations as Flash } from '../flash'
// import { simSelectors } from "."

// sync actions

const changePlayerState = actions.changePlayerState
const jump = actions.jump
const loadPlayer = actions.loadPlayer
const moveCursor = actions.moveCursor
const pause = actions.pause
const resize = actions.resize
const selectAgent = actions.selectAgent
const stop = actions.stop
const tick = actions.tick
const update = actions.update
const updateVideo = actions.updateVideo

// async actions

/**
 * Joins simulation channel and returns channel object.
 * Also subscribes to channel events and dispatches actions accordingly.
 * @param { number } video_id
 */
const join = video_id => (dispatch => {

  const channel = socket.channel(`sim:${video_id}`, () =>
    ({ last_seen: "2000-01-01T00:00:00.0" }))

// if(params.overlays){
// // channel.on('delete_overlay', overlay =>
// //   dispatch({
// //     type: DELETE_OVERLAY,
// //     youtubeID: overlay.youtubeID
// //   })
// // );

// // channel.on('set_overlay', overlay =>
// //   dispatch({ type: SET_OVERLAY, overlay })
// // );
// }


// // listen for new/updated markers
// channel.on('set_marker', marker =>
//   dispatch({ type: SET_MARKER, marker }));

// channel.on('remove_agent', res =>
//   dispatch({ type: DELETE_AGENT, ...res })
// );

// channel.on('remove_all_agents', () =>
//   dispatch({ type: DELETE_ALL_AGENTS })
// );

  channel.join()
  .receive('ok', ({ last_seen, markers }) => {

    channel.params.last_seen = last_seen

    // // if markers are in absolute coords convert to relative first
    // if(params.abs)
    //   simParams.markers = simSelectors.convertToRel(simParams.markers)

    dispatch(actions.join(parseInt(video_id), markers))
  })
  .receive('error', res => {
    dispatch(actions.joinError())
    dispatch(Flash.get(res))
  })

  return channel
})

const leave = channel => (dispatch => {
  channel.leave()
  dispatch(actions.leave())
})

const play = () => (dispatch => {
  dispatch(actions.play())
  window.simTimer = setInterval(() => dispatch(tick()), REFRESH_INTERVAL)
})

const setMarker = ( x, y ) => {
  return (dispatch, store) => {
    const { sim } = store()
    sim.channel.push(
      'set_marker',
      { agent: sim.agentSelected, time: sim.time, x, y }
    )
    .receive('ok', marker => {
      dispatch(update({ agentSelected: marker.agent }))
      dispatch(jump())
    })
  }
}

const setMode = ( mode ) => {
  return (dispatch) => {
    dispatch(pause())
    dispatch(update({ mode }))
  }
}

export default {
  changePlayerState,
  join,
  jump,
  leave,
  loadPlayer,
  moveCursor,
  play,
  pause,
  resize,
  selectAgent,
  setMarker,
  setMode,
  stop,
  tick,
  update,
  updateVideo
};
