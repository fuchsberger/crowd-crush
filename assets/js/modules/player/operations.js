
import actions from "./actions"

const changeState = actions.changeState
const pause = actions.pause
const ready = actions.ready
const stop = actions.stop

const play = () => (dispatch => {
  dispatch(actions.play())
  window.simTimer = setInterval(() => dispatch(tick()), REFRESH_INTERVAL)
})

export default {
  changeState,
  play,
  pause,
  ready,
  stop
}
