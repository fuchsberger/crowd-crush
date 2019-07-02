import { includes, map, reject } from 'lodash/collection'
import types from "./types"
import { REFRESH_INTERVAL } from '../../config'

const initialState = {
  agentSelected: null,
  channel: null,
  error: false,
  jumpTime: 1.0,
  markers: [],
  mode: 'play', // modes: coords, markers, play (default)
  overlay: null,
  overlays: null,
  playing: false,
  player: null,
  player_ready: false,
  player_state: -1,
  time: 0,
  video_id: null,
  window_height: window.innerHeight,
  window_width: window.innerWidth

  // agentHovered: null,

  // coordSelected: null,
  // channel: null,
  // cursorX: null,
  // cursorY: null,
  // error: false,
  // frameLeft: 0,
  // frameScaleX: 1,
  // frameScaleY: 1,
  // frameTop: 0,

  // markers: null,
  // markers2: null,
  // video: null,
  // windowRatio: window.innerWidth / (window.innerHeight - 110)
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
        // player: state.overlay == null ? state.player : null,
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
        markers: [
          ...reject(state.markers, m => includes(map(payload.markers, m => m.id), m.id)),
          ...payload.markers
        ],
        overlays: payload.overlays,
        video_id: payload.video_id
      }

    case types.LEAVE:
      return initialState

    case types.LOAD_PLAYER:
      return { ...state, player: payload.player }

    case types.PLAY:
      console.log(state.player)
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

    case types.RESIZE:
      return {
        ...state,
        window_height: window.innerHeight,
        window_width: window.innerWidth
      }

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
