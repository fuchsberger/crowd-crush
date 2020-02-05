import types from "./types"

const changeState = () => ({ type: types.CHANGE_STATE })

const changeJumpInterval = time => ({ type: types.CHANGE_JUMP_INTERVAL, time })

const jump = direction => ({ type: types.JUMP, direction })

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
  changeJumpInterval,
  jump,
  leave,
  play,
  pause,
  ready,
  stop,
  tick
}
