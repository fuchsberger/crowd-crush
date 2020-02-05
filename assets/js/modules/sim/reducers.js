import update from 'immutability-helper'
import { reject } from 'lodash/collection'
import types from "./types"

const initialState = {
  agents: null,
  agentHovered: null,
  agentSelected: null,
  channel: null,
  error: false,
  map: null,
  overlay: null,
  overlays: null,
  robots: [],
  x: null,
  y: null,
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

    case types.CLEAR_ERROR:
      return { ...state, error: false }

    case types.ERROR:
      return { ...state, error: true }

    case types.JOIN:
      return { ...state, ...payload }

    case types.LEAVE:
      return initialState

    case types.VIDEO_NOT_FOUND:
      return { ...initialState, error: true }

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
      // }s

    case types.SET_MARKER:

      const {agent, ...marker } = payload.marker

      // agent exists, so insert the marker at correct position
      if(state.agents.hasOwnProperty(agent)){

        const markers = state.agents[agent]

        // go through all markers and find index where to insert/update
        for(var i = 0; i < markers.length; i++){

          // current index matches time ==> replace marker here
          if(markers[i][0] == marker.time){
            markers.splice(i, 1, [marker.time, marker.x, marker.y])
            break
          }
          // current time has already surpassed marker --> add at previous index
          if (markers[i][0] > marker.time) {
            markers.splice(i-1, 0, [marker.time, marker.x, marker.y])
            break
          }
          // last marker reached, just add here at the end
          if (i + 1 == markers.length)
            markers.push([marker.time, marker.x, marker.y])
        }

        // add marker and optionally remove previous marker at that time
        return update(state, { agents: { [agent]: { $set: markers }} })
      }

      // else agent does not exist so create it with a single marker:
      return update(state, { agents: { [agent]: { $set: [[marker.time, marker.x, marker.y]] }}})

    case types.REMOVE_MARKERS:
      // if an agent is currently selected, remove those markers
      if(state.agentSelected)
        return update(state, {
          agents: { $unset: [state.agentSelected]},
          agentSelected: {$set: null}
        })

      // by default remove all agents
      return update(state, {
        agentSelected: {$set: null},
        video: { agents: {$set: {}}}
      })

    case types.SPAWN:
      return { state, ...payload }

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
