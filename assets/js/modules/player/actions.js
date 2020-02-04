import types from "./types"

const changeState = () => ({ type: types.CHANGE_STATE })

const leave = () => ({ type: types.LEAVE })

const play = () => ({ type: types.PLAY })

const pause = () => {
  clearInterval(window.simTimer)
  return { type: types.PAUSE }
}

const ready = instance => ({ type: types.READY, instance })

const stop = () => {
  clearInterval(window.simTimer)
  return { type: types.STOP }
}

const tick = () => ({ type: types.TICK })

export default {
  changeState,
  leave,
  play,
  pause,
  ready,
  stop,
  tick
}
