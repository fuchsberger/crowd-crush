import { Api } from "../../utils"
import { REFRESH_INTERVAL } from '../../config'
import actions from "./actions"
import { simSelectors } from "."

// sync actions

const jump = actions.jump
const leave = actions.leave
const loadPlayer = actions.loadPlayer
const moveCursor = actions.moveCursor
const resize = actions.resize
const selectAgent = actions.selectAgent
const tick = actions.tick
const update = actions.update
const updateVideo = actions.updateVideo

// async actions

const join = ( video_id, params = {} ) => {
  return (dispatch, store) => {
    const socket = store().session.socket
    const channel = Api.configSimChannel(socket, dispatch, video_id, params)

    channel.join()
    .receive('ok', ( res ) => {
      const { syncTime, ...simParams} = res
      channel.params.syncTime = syncTime

      // if markers are in absolute coords convert to relative first
      if(params.abs)
        simParams.markers = simSelectors.convertToRel(simParams.markers)

      dispatch(actions.join( channel, simParams ));
    })
    .receive('error', () => dispatch(actions.joinError()))
  }
}

const play = () => {
  return (dispatch, store) => {
    const player = store().sim.player
    if(player) player.playVideo()
    window.simTimer = setInterval(
      () => dispatch(actions.tick()),
      REFRESH_INTERVAL
    );
    dispatch(update({ running: true }))
  }
}

const pause = () => {
  return (dispatch, store) => {
    const player = store().sim.player
    if(player) player.pauseVideo()
    clearInterval(window.simTimer)
    dispatch(update({ running: false }))
  }
}

const stop = () => {
  return (dispatch, store) => {
    const player = store().sim.player
    if(player){
      player.pauseVideo()
      player.seekTo(0, true)
    }
    clearInterval(window.simTimer)
    dispatch(update({ running: false, time: 0 }))
  }
}

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
