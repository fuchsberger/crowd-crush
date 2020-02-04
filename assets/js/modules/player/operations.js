import { REFRESH_INTERVAL } from '../../config'
import actions from "./actions"

const changeState = actions.changeState
const leave = actions.leave
const pause = actions.pause
const ready = actions.ready
const stop = actions.stop

const play = () => (dispatch => {
  dispatch(actions.play())
  window.simTimer = setInterval(() => dispatch(actions.tick()), REFRESH_INTERVAL)
})

export default {
  changeState,
  leave,
  play,
  pause,
  ready,
  stop
}
