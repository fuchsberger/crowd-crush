import socket from '../socket'
import h337 from 'heatmap.js'
// import { Api } from "../../utils"

import actions from "./actions"
import { playerOperations as Player } from '../player'
import { sceneOperations as Scene, sceneSelectors } from '../scene'
import { flashOperations as Flash } from '../flash'

// import { simSelectors } from "."

const hoverAgent = actions.hoverAgent
const selectAgent = actions.selectAgent
const changeMode = actions.changeMode
const clearError = actions.clearError
const resize = actions.resize
const setOverlay = actions.setOverlay
const update = actions.update
const updateVideo = actions.updateVideo

// async actions

/**
 * Joins simulation channel and returns channel object.
 * Also subscribes to channel events and dispatches actions accordingly.
 * @param { number } video_id
 */
const join = video_id => (dispatch, store) => {

  const channel = socket.channel(`sim:${video_id}`)

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

  channel.join()
    .receive('ok', ({ video }) => {

    const { agents, ...vid } = video

    // if markers are in absolute coords convert to relative first
    // if(params.abs) simParams.markers = simSelectors.convertToRel(simParams.markers)
    dispatch(Scene.load(vid))
    dispatch(actions.join(agents, channel))
  })
}

const leave = () => (dispatch, getState) => {
  const { sim } = getState()
  if(sim.channel) sim.channel.leave()
  dispatch(actions.leave())
}

// Overlays
const createOverlay = (channel, data) => dispatch => {
  channel.push('create_overlay', data)
  .receive('error', () => dispatch(actions.error()))
}
const deleteOverlay = (channel, id) => _dispatch => channel.push(`delete_overlay:${id}`)

// markers

const setMarker = (e) => {
  return (dispatch, store) => {

    const { player, sim } = store()
    const { agentSelected, channel, x, y } = sim

    channel.push('set_marker', { agent: agentSelected, time: player.time, x, y })
    .receive('ok', ({ agent }) => {
      dispatch(selectAgent(agent))
      dispatch(Player.jump('forward'))
    })
  }
}

const deleteMarkers = () => {
  return (dispatch, store) => {
    const { channel, agentSelected } = store().sim
    channel.push("delete_markers", { agent: agentSelected })
    .receive('ok', () => dispatch(actions.removeMarkers()))
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

// heatmap
const setHeatMap = () => {
  const map = h337.create({
    container: document.getElementById('overlay'),
    radius: 45,
    maxOpacity: .7,
    minOpacity: 0,
    blur: .75
  })

  return (dispatch) => {
    dispatch(actions.createMap(map))
  }
}

const spawn = dimensions => {
  return (dispatch, store) => {

    const { agents, map } = store().sim

    // determine how many agents are visible in screen one
    // (only those that have a marker in first frame)
    const target_count = Object.values(agents).filter(a => a[0][0] == 0).length

    let attempts = 0
    let i = 0
    const robots = {}

    // attempt to create 10 agents. Procedure:
    // 1.   randomly select a coordinate and get its likelyhood value
    // 2.   roll a dice (0-100) and see if it is within the likelyhood value.
    // 3.a  if so, check distance to other agents and create agent if possible
    // 3.b  if outside, repeat

    while (i < target_count && attempts < 10000) {
      const roll = Math.floor(Math.random() * 100) + 1
      const x = Math.random()
      const y = Math.random()

      if (roll <= map.getValueAt({
        x: Math.floor(x * dimensions[0]),
        y: Math.floor(y * dimensions[1])
      })) {
        robots[i] = [[0, x, y]]
        i++
      }
      attempts++
    }
    dispatch(actions.spawn(robots))
  }
}

export default {
  // overlays
  createOverlay,
  deleteOverlay,
  setOverlay,

  // simulation controls

  changeMode,

  // marker controls
  hoverAgent,
  selectAgent,
  deleteMarkers,

  // marker/coords controls
  moveCursor,

  clearError,
  join,
  leave,
  resize,
  setMarker,
  update,
  updateVideo,

  // heatmap
  setHeatMap,
  spawn
};
