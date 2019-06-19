import { includes, map, reject } from 'lodash/collection'
import { REFRESH_INTERVAL } from '../../config'
import types from "./types"
import selectors from "./selectors"

const initialState = {
  error: false,
  markers: [],
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
  // player: null,
  // running: false,
  // time: 0,
  // video: null,
  // windowRatio: window.innerWidth / (window.innerHeight - 110)
}

const reducer = ( state = initialState, { type, ...payload} ) => {
  switch ( type ) {
    case types.JOIN:
      return {
        ...state,
        markers: [
          ...reject(state.markers, m => includes(map(payload.markers, m => m.id), m.id)),
          payload.markers
        ],
        video_id: parseInt(payload.video_id)
        // ...initialState,
        // ...action.payload,
        // error: false
      }

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

    // case types.TICK:

    //   if (action.time != null) return { ...state, time: action.time }

    //   let time = state.player
    //     ? Math.round(state.player.getCurrentTime() * 1000)
    //     : state.time
    //   time = time < state.duration ? time + REFRESH_INTERVAL : 0;
    //   return { ...state, time }

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
