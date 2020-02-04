import types from "./types"

const changeState = () => ({ type: types.CHANGE_STATE })

const play = () => ({ type: types.PLAY })

const pause = () => {
  clearInterval(window.simTimer)
  return { type: types.PAUSE }
}

const ready = () => ({ type: types.READY })

const stop = () => {
  clearInterval(window.simTimer)
  return { type: types.STOP }
}

export default {
  changeState,
  play,
  pause,
  ready,
  stop
};
