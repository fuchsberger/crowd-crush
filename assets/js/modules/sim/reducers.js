import update from 'immutability-helper'
import { reject } from 'lodash/collection'
import types from "./types"
import { REFRESH_INTERVAL } from '../../config'

const get_window_ratio = () => window.innerWidth / (window.innerHeight - 40)

const initialState = {
  agentHovered: null,
  agentSelected: null,
  channel: null,
  error: false,
  jumpTime: 1.0,
  map: null,
  mode: "play-video",
  overlay: null,
  overlays: null,
  playing: false,
  player: null,
  player_ready: false,
  player_state: -1,
  synthAgents: [],
  time: 0,  // in seconds (simulation)
  x: null,
  y: null,
  video: null,
  // coordSelected: null,

  // frameLeft: 0,
  // frameScaleX: 1,
  // frameScaleY: 1,
  // frameTop: 0,
}

const reducer = ( state = initialState, { type, ...payload} ) => {
  switch ( type ) {

    // OVERLAYS ----------------------------------------------------------------------------------

    case types.ADD_OVERLAY:
      return { ...state, overlays: [ ...state.overlays, payload.overlay ]}

    case types.REMOVE_OVERLAY:
      return {
        ...state,
        // If currently selected overlay is being deleted show normal video instead.
        overlay: state.overlay == payload.overlay.youtubeID ? null : state.overlay,
        overlays: reject(state.overlays, o => o.id == payload.overlay.id)
      }

    case types.SET_OVERLAY:
      if(payload.overlay == state.overlay) return state
      clearInterval(window.simTimer)
      return {
        ...state,
        overlay: payload.overlay,
        player: payload.overlay == 'white' ? null : state.player,
        playing: false,
        player_ready: payload.overlay == 'white',
      }

    // SIMULATION --------------------------------------------------------------------------------
    case types.HOVER_AGENT:
      return { ...state, agentHovered: payload.id}

    case types.SELECT_AGENT:
      return { ...state, agentSelected: payload.agent || state.agentHovered }

    case types.MOVE_CURSOR:
      return { ...state, x: payload.x, y: payload.y }

    // HEATMAP -----------------------------------------------------------------------------------

    case types.SET_HEATMAP:
      return update(state, {
        map: { $set: payload.map }
      })

    // OTHER -------------------------------------------------------------------------------------

    case types.CHANGE_MODE:
      clearInterval(window.simTimer)
      if(state.playing && state.player){
        state.player.pauseVideo()
        state.player.seekTo(0, true)
      }
      return {
        ...state,
        mode: payload.mode,
        overlay: null,
        playing: false,
        player_ready: state.overlay == null ? true : false,
        time: 0
      }

    case types.CHANGE_JUMP_INTERVAL:
      return { ...state, jumpTime: payload.time }

    case types.CHANGE_PLAYER_STATE:
      const player_state = state.player.getPlayerState()
      if(player_state == 1 && !state.player_ready){
        state.player.pauseVideo()
        state.player.seekTo(0, true)
        return { ...state, player_ready: true, player_state }
      }
      return { ...state, player_state }

    case types.CLEAR_ERROR:
      return { ...state, error: false }

    case types.ERROR:
      return { ...state, error: true }

    case types.JOIN:
      return {
        ...state,
        channel: payload.channel,
        video: payload.video
        // overlays: payload.overlays,
      }

    case types.LEAVE:
      return initialState

    case types.LOAD_PLAYER:
      return { ...state, player: payload.player }

    case types.PLAY:
      if(state.player) state.player.playVideo()
      return { ...state, playing: true }

    case types.PAUSE:
      if(state.player) state.player.pauseVideo()
      return { ...state, playing: false }

    case types.STOP:
      if(state.player){
        state.player.pauseVideo()
        state.player.seekTo(0, true)
      }
      return { ...state, playing: false, time: 0 }

    case types.TICK:
      return { ...state,
        time: state.player
          ? state.player.getCurrentTime()
          : state.time + REFRESH_INTERVAL / 1000
      }

    case types.VIDEO_NOT_FOUND:
      return { ...initialState, error: true }

    case types.JUMP:
      let time
      switch(payload.direction){
        case 'forward': time = state.time + state.jumpTime; break
        case 'backward': time = Math.max(0, state.time - state.jumpTime); break
      }

      // jump to time and update player state
      if(state.player_ready) {
        state.player.pauseVideo()
        state.player.seekTo(time, true)
      }
      return { ...state, time }

      // let nTime;

      // if (action.agent) {
      //   // find time of first or last agent marker
      //   nTime = action.forward
      //     ? endTime(state.agentSelected, state.markers)
      //     : startTime(state.agentSelected, state.markers)
      // } else {
      //   // get last jumpMarkerTime and jump forward or backward to next interval
      //   const last = parseInt(state.time / state.jumpTime, 10) * state.jumpTime;
      //   nTime = action.forward
      //     ? Math.min(last + state.jumpTime, state.duration)
      //     : Math.max(last - state.jumpTime, 0);
      // }

    case types.SET_MARKER:

      const {agent, ...marker } = payload.marker

      // agent exists, so insert the marker at correct position
      if(state.video.agents.hasOwnProperty(agent)){

        const markers = state.video.agents[agent]

        // go through all markers and find index where to insert/update
        let replace = 0
        for(var i = 0; i < markers.length; i++){

          // current index matches time ==> replace marker here
          if(markers[i][0] == state.time*1000){
            replace = 1
            break
          }
          // marker's time already passed current time --> pick previous index
          if(markers[i][0] > state.time*1000){
            i--
            break
          }
          // end of list reached --> index will be last one in list
        }

        // add marker and optionally remove previous marker at that time
        markers.splice(i, replace, [state.time * 1000, state.x, state.y])
        return update(state, {
          video: { agents: { [agent]: { $set: markers } }}
        })
      }

      // else agent does not exist so create it with a single marker:
      return update(state, {
        video: { agents: { [agent]: { $set: [[marker.time, marker.x, marker.y]] }}}
      })

    case types.REMOVE_MARKERS:
      // if an agent is currently selected, remove those markers
      if(state.agentSelected)
        return update(state, {
          agentSelected: {$set: null},
          video: { agents: { $unset: [state.agentSelected]}
        }})

      // by default remove all agents
      return update(state, {
        agentSelected: {$set: null},
        video: { agents: {$set: {}}}
      })

    case types.RESIZE:
      return { ...state, window_ratio: get_window_ratio() }

    case types.SIMULATE:
      return update(state, {
        synthAgents: { $set: payload.agents }
      })

    case types.SET_MODE:
      return update(state, { mode: { $set: payload.mode } })

    default:
      return state
  }
}

// Helper functions
// const startTime = (agentSelected, markers ) => {
//   for(let i = 0; i < markers.length; i++){
//     if(markers[i][0] == agentSelected) return markers[i][1];
//   }
// }

// const endTime = (agentSelected, markers ) => {
//   for(let i = markers.length-1; i != 0; i--){
//     if(markers[i][0] == agentSelected) return markers[i][1];
//   }
// }

export default reducer
