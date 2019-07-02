import socket from '../socket'
// import { Api } from "../../utils"
import { REFRESH_INTERVAL } from '../../config'
import actions from "./actions"
import { flashOperations as Flash } from '../flash'
// import { simSelectors } from "."

// sync actions

// marker actions
const hoverAgent = actions.hoverAgent
const selectAgent = actions.selectAgent

const changeJumpInterval = actions.changeJumpInterval
const changeMode = actions.changeMode
const changePlayerState = actions.changePlayerState
const clearError = actions.clearError
const error = actions.error
const jump = actions.jump
const loadPlayer = actions.loadPlayer
const moveCursor = actions.moveCursor
const pause = actions.pause
const resize = actions.resize
const setOverlay = actions.setOverlay
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

  const channel = socket.channel(`sim:${video_id}`, () => ({last_seen: "2000-01-01T00:00:00.0"}))

// if(params.overlays){
// // channel.on('delete_overlay', overlay =>
// //   dispatch({
// //     type: DELETE_OVERLAY,
// //     youtubeID: overlay.youtubeID
// //   })
// // );

  channel.on('add_overlay', overlay => dispatch(actions.addOverlay(overlay)))
  channel.on('remove_overlay', overlay => dispatch(actions.removeOverlay(overlay)))

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
  .receive('ok', ({ last_seen, markers, overlays }) => {

    channel.params.last_seen = last_seen

    // // if markers are in absolute coords convert to relative first
    // if(params.abs)
    //   simParams.markers = simSelectors.convertToRel(simParams.markers)

    dispatch(actions.join(video_id, channel, markers, overlays))
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

// Overlays
const createOverlay = (channel, data) => dispatch => {
  channel.push('create_overlay', data)
  .receive('error', () => dispatch(actions.error()))
}
const deleteOverlay = (channel, id) => _dispatch => channel.push(`delete_overlay:${id}`)

const setMarker = e => {
  return (dispatch, store) => {

    e.stopPropagation()

    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const { sim } = store()

    sim.channel.push('set_marker', { agent: sim.agentSelected, time: sim.time, x, y })
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
  // overlays
  createOverlay,
  deleteOverlay,
  setOverlay,

  // simulation controls
  changeJumpInterval,
  changeMode,
  setMode,

  // marker controls
  hoverAgent,
  selectAgent,

  // player
  changePlayerState,
  loadPlayer,
  play,
  pause,
  stop,
  tick,

  clearError,
  join,
  jump,
  leave,
  moveCursor,
  resize,

  setMarker,
  update,
  updateVideo
};
