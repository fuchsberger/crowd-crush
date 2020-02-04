import types from "./types"

const initialState = {
  instance: null,
  state: -1,
  time: 0  // in seconds (simulation)
}

const reducer = ( state = initialState, { type, ...payload} ) => {
  switch (type) {

    case types.CHANGE_STATE:
      return { ...state, state: state.instance.getPlayerState() }

    case types.PLAY:
      if(state.instance) state.instance.playVideo()
      return state

    case types.LEAVE:
      return initialState

    case types.PAUSE:
      if(state.instance) state.instance.pauseVideo()
      return state

    case types.READY:
      return { ...state, instance: payload.instance}

    case types.STOP:
      // allows player controls to operate without actual youtube player
      if(state.instance){
        state.instance.pauseVideo()
        state.instance.seekTo(0, true)
      }
      return {
        ...state, time: 0
      }

    case types.TICK:
      return { ...state,
        time: state.instance
          ? state.instance.getCurrentTime()
          : state.time + REFRESH_INTERVAL / 1000
      }

    default:
      return state
  }
}

export default reducer
