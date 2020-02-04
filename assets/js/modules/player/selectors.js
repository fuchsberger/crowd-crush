import { createSelector } from 'reselect'

const state = state => state.player.state
const loaded = state => !!state.player.instance

const playing = createSelector([state], state => state == 1 || state == 3)

export default {
  loaded,
  playing
}
