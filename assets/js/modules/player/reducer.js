import types from "./types"

const initialState = {
  // playing: false,
  loaded: false
}

const reducer = ( state = initialState, { type, ...payload} ) => {
  switch ( type ) {
    // case types.LOAD_PLAYER:
    //   return { ...state, player: payload.player }

    case types.CHANGE_STATE:
      const player_state = state.player.getPlayerState()
      if(player_state == 1 && !state.player_ready){
        state.player.pauseVideo()
        state.player.seekTo(0, true)
        return { ...state, player_ready: true, player_state }
      }
      return { ...state, player_state }

    case types.PLAY:
      if(state.player) state.player.playVideo()
      return { ...state, playing: true }

    case types.PAUSE:
      if(state.player) state.player.pauseVideo()
      return { ...state, playing: false }

    case types.READY:
      return { ...state, loaded: true}

    case types.STOP:
      if(state.player){
        state.player.pauseVideo()
        state.player.seekTo(0, true)
      }
      return { ...state, playing: false, time: 0 }

    default:
      return state
  }
}

export default reducer
