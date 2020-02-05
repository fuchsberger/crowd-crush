import types from "./types"

const initialState = {
  instance: null,
  jumpTime: 1.0,
  state: -1,
  time: 0  // in seconds (simulation)
}

const reducer = ( state = initialState, { type, ...payload } ) => {
  switch (type) {

    case types.CHANGE_STATE:
      const player_state = state.instance.getPlayerState()
      if (player_state == 1 && state.state == -1) {
        state.instance.pauseVideo()
        state.instance.seekTo(0, true)
        return state
      }
      return { ...state, state: player_state }

    case types.CHANGE_JUMP_INTERVAL:
      return { ...state, jumpTime: payload.time }

    case types.JUMP:
      let time
      switch(payload.direction){
        case 'forward': time = state.time + state.jumpTime; break;
        case 'backward': time = Math.max(0, state.time - state.jumpTime);
      }

      // jump to time and update player state
      if(state.instance) {
        state.instance.pauseVideo()
        state.instance.seekTo(time, true)
      }
      return { ...state, time }

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
