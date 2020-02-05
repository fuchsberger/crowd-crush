import { createSelector } from 'reselect'

const duration = state => state.scene.duration
const state = state => state.player.state
const jumpTime = state => state.player.jumpTime
const loaded = state => !!state.player.instance
const time = state => parseInt(state.player.time)

const backwardPossible = createSelector([jumpTime, time], (j, t) => t - j >= 0 ? true : false)
const forwardPossible = createSelector([ duration, jumpTime, time ],
  (d, j, t) => t + j <= d ? true : false)

const playing = createSelector([state], state => state == 1 || state == 3)

export default {
  backwardPossible,
  forwardPossible,
  jumpTime,
  loaded,
  playing,
  time
}
