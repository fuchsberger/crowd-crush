import { createSelector } from 'reselect'


const scene = state => state.scene

const aspectratio = createSelector([scene], scene => scene.aspectratio)

const dimensions = createSelector([aspectratio], ar_video => {
  const screenX = window.innerWidth
  const screenY = window.innerHeight - 40
  if (!ar_video) return [screenX, screenY]

  // screen is wider than video -> fix height and get scaled width
  if (screenX / screenY > ar_video) return [screenY * ar_video, screenY]
  else return [screenX, screenX / ar_video]
})

const duration = createSelector([scene], scene => scene.duration)

const id = createSelector( [scene], scene => scene.youtubeID )

export default {
  dimensions,
  duration,
  id,
  scene
}
