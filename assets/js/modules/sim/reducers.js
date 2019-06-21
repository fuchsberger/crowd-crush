import { includes, map, reject } from 'lodash/collection'
import { REFRESH_INTERVAL } from '../../config'
import types from "./types"
import selectors from "./selectors"

const initialState = {
  error: false,
  duration: 0,
  markers: [],
  playing: false,
  player: null,
  player_ready: false,
  player_state: -1,
  video_id: null,

  // agentHovered: null,
  // agentSelected: null,
  // coordSelected: null,
  // channel: null,
  // cursorX: null,
  // cursorY: null,
  // error: false,
  // frameLeft: 0,
  // frameScaleX: 1,
  // frameScaleY: 1,
  // frameTop: 0,
  // jumpTime: 1000,
  // markers: null,
  // markers2: null,
  // mode: 'sim', // modes: coords, markers, sim (default)
  // overlay: null,
  // overlays: null,
  // time: 0,
  // video: null,
  // windowRatio: window.innerWidth / (window.innerHeight - 110)
}

const reducer = ( state = initialState, { type, ...payload} ) => {
  switch ( type ) {

    case types.CHANGE_PLAYER_STATE:
      const player_state = state.player.getPlayerState()
      if(player_state == 1 && !state.player_ready){
        state.player.pauseVideo()
        state.player.seekTo(0, true)
        return { ...state, player_ready: true, player_state }
      }
      return { ...state, player_state }

    case types.JOIN:
      return {
        ...initialState,
        duration: payload.duration * 1000,
        markers: [
          ...reject(state.markers, m => includes(map(payload.markers, m => m.id), m.id)),
          ...payload.markers
        ],
        video_id: payload.video_id
      }

    case types.LOAD_PLAYER:
      return { ...state, player: payload.player }

    case types.PLAY:
      state.player.playVideo()
      return state

    case types.PAUSE:
      state.player.pauseVideo()
      return state

    case types.STOP:
      state.player.pauseVideo()
      state.player.seekTo(0, true)
      return { ...state, time: 0 }

    // updates the time every few(*) milliseconds (* defined in REFRESH_INTERVAL)
    case types.TICK:
      return { ...state, time: state.player.getCurrentTime() }

    case types.VIDEO_NOT_FOUND:
      return { ...initialState, error: true }

    // case types.JUMP:
    //   let nTime;

    //   if (action.agent) {
    //     // find time of first or last agent marker
    //     nTime = action.forward
    //       ? endTime(state.agentSelected, state.markers)
    //       : startTime(state.agentSelected, state.markers)
    //   } else {
    //     // get last jumpMarkerTime and jump forward or backward to next interval
    //     const last = parseInt(state.time / state.jumpTime, 10) * state.jumpTime;
    //     nTime = action.forward
    //       ? Math.min(last + state.jumpTime, state.duration)
    //       : Math.max(last - state.jumpTime, 0);
    //   }

    //   // jump to time and update player state
    //   if(state.player) {
    //     state.player.pauseVideo();
    //     state.player.seekTo(nTime / 1000, true);
    //   }
    //   return { ...state, time: nTime }

    case types.LEAVE:           return initialState

    // case types.RESIZE:
    //   return {
    //     ...state,
    //     windowRatio: window.innerWidth / (window.innerHeight - 110)
    //   }

    // case types.SELECT_AGENT:
    //   return { ...state, agentSelected: state.agentHovered }


    // case types.UPDATE:
    //   return { ...state, ...action.params }

    // case types.UPDATE_VIDEO:
    //   return { ...state, video: { ...state.video, ...action.params }}

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
