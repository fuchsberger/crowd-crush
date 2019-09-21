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
const join = video_id => dispatch => {

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
  channel.on('set_marker', marker => dispatch(actions.setMarker(marker)))

// channel.on('remove_agent', res =>
//   dispatch({ type: DELETE_AGENT, ...res })
// );

  channel.on('remove_markers', ({ agent }) => dispatch(actions.removeMarkers(agent)))

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
}

const leave = () => (dispatch, getState) => {
  const { sim } = getState()
  sim.channel.leave()
  dispatch(actions.leave())
}

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

// markers

const setMarker = e => {
  return (dispatch, store) => {

    const { agentSelected, channel, x, y, time } = store().sim

    channel.push('set_marker', { agent: agentSelected, time, x, y })
    .receive('ok', ({ agent }) => {
      dispatch(selectAgent(agent))
      dispatch(jump('forward'))
    })
  }
}

const deleteMarkers = (channel, agent='all') => _dispatch =>
  channel.push(`delete_markers:${agent}`)

const setMode = ( mode ) => {
  return (dispatch) => {
    dispatch(pause())
    dispatch(update({ mode }))
  }
}

const moveCursor = e => dispatch => {
  if(!e) return dispatch(actions.moveCursor(null, null))

  e = e.nativeEvent
  const container = e.target.getBoundingClientRect()

  var x = (e.clientX - container.x) / container.width
  var y = (e.clientY - container.y) / container.height

  dispatch(actions.moveCursor(x, y))
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
  deleteMarkers,

  // marker/coords controls
  moveCursor,

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
  resize,
  setMarker,
  update,
  updateVideo
};
