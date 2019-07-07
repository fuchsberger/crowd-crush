import { createSelector } from 'reselect'
import { uniq, pull } from 'lodash/array'
import { find, groupBy, map, sortBy } from 'lodash/collection'
import { round } from 'lodash/math'
import { videoSelectors as Video } from '../video'

const agentSelected = state => state.sim.agentSelected
const x = state => state.sim.x
const y = state => state.sim.y
const channel = state => state.sim.channel
const error = state => state.sim.error
const jumpTime = state => state.sim.jumpTime
const markers = state => state.sim.markers
const markers2 = state => state.sim.markers2
const mode = state => state.sim.mode
const overlay = state => state.sim.overlay
const overlays = state => state.sim.overlays
const player = state => state.sim.player
const playerReady = state => state.sim.player_ready
const playing = state => state.sim.playing
const time = state => state.sim.time
const videoRatio = state => state.sim.video.aspectratio
const windowHeight = state => state.sim.window_height
const windowWidth = state => state.sim.window_width
const video_id = state => state.sim.video_id

// DERIVED DATA

const xRounded = createSelector([x], x => x == null ? '-- x --' : round(x, 3))
const yRounded = createSelector([y], y => y == null ? '-- y --' : round(y, 3))

const channelReady = createSelector([video_id], id => id != null)

const video = createSelector([Video.all, video_id], (videos, id) => find(videos, v => v.id == id))

const aspectRatio = createSelector([ video ], v => v ? v.aspectratio : 1)
const duration = createSelector([ video ], v => v ? v.duration: 1)

const backwardPossible = createSelector([jumpTime, time], (j, t) => t - j >= 0 ? true : false)
const forwardPossible = createSelector([ duration, jumpTime, time ],
  (d, j, t) => t + j <= d ? true : false)

const sortedMarkers = createSelector([ markers ], markers => sortBy(markers, ['agent', 'time']))
const sortedOverlays = createSelector([ overlays ], overlays => sortBy(overlays, 'title'))

/**
 * Converts an array of abs coordinates to relative coordinates
 * @param {[]} markers
 */
const convertToRel = ( markers ) => {

  // let left = 100000, top = 100000, right = 0, bottom = 0;

  // for(let i = 0; i < markers.length; i++){
  //   if(markers[i][1] > 0) continue;

  //   if(markers[i][2] < left) left = markers[i][2]
  //   else if(markers[i][2] > right) right = markers[i][2]

  //   if(markers[i][3] < top) top = markers[i][3]
  //   else if(markers[i][3] > bottom) bottom = markers[i][3]
  // }

  // const width = right - left
  // const height = bottom - top

  // console.log(width, height)

  // calculate boundaries
  let N = 0, W = 0, S = 0, E = 0;

  for(let i = 0; i < markers.length; i++){
    if (markers[i][1] > 0) continue;
    if (markers[i][3] < N) N = markers[i][3]
    else if (markers[i][3] > S) S = markers[i][3]
    if (markers[i][2] < W) W = markers[i][2]
    else if (markers[i][2] > E) E = markers[i][2]
  }

  // convert coordinates to relative
  for(let i = 0; i < markers.length; i++){
    // markers[i][2] = left + (width + left) * (markers[i][2] - W) / (E - W)
    // markers[i][3] = top + (height + top) * (markers[i][3] - N) / (S - N)
    markers[i][2] = (markers[i][2] - W) / (E - W)
    markers[i][3] = (markers[i][3] - N) / (S - N)
  }
  return markers;
}

/**
 * Produces CSS styling for a container to maintain a given aspectratio
 */
const frameCSS = createSelector( [ aspectRatio, windowHeight, windowWidth ],
  ( aspectRatio, h, w ) => {

    let wDist = 0, hDist = 0;

    // get screen size, account for navbar on top
    // w = player ? window.innerWidth : window.innerWidth / 2

    // if screen is wider than video, center horizontally, otherwise vertically
    if (w / h > aspectRatio) wDist = (w - aspectRatio * h) / 2 / w;
    else hDist = (h - w / aspectRatio) / 2 / h;

    if(wDist > hDist) return { left: wDist*100+"%", right: wDist*100+"%" }
    return { top: hDist*100+"%", bottom: hDist*100+"%" }
  }
)

/**
 * Given an aspectratio, calculates scaling values such that relative coords
 * are not stretched and centered in the available space
 * @param {number} aspectratio
 */
const getAdjustments = ( aspectratio ) => {

  let h_mult = 1, h_offset = 0, w_mult = 1, w_offset = 0;
  if (aspectratio >= 1) {
    h_mult = 1 / aspectratio
    h_offset = (1 - h_mult) / 2
  } else {
    w_mult = 1 / aspectratio
    w_offset = (1 - w_mult) / 2
  }
  return { h_mult, h_offset, w_mult, w_offset }
}

/**
 * returns each agents approximated position at a given time,
 * given a list of markers in the format [agent_id, time, x, y]
 * list must be sorted first by agent_id and second by time
 */
const agents = createSelector(
  [ sortedMarkers, time], ( markers, time ) => {

    // group markers by agent and calculate approximate position at a given time
    const agents = map(groupBy(markers, 'agent'), a => {
      for(let i = 0; i < a.length; i++){
        const m = a[i]

        // if current time matches an agents markers time exactly show agent
        if(m.time == time) return { id: m.agent, x: m.x, y: m.y }

        // end of line reached / only one marker available --> do not show inactive agents
        if(i+1 == a.length) return null

        const n = a[i+1]

        // if time is in between this and next marker we approximate the position
        if(m.time <= time && time <= n.time)
        return {
          id: m.agent,
          x: (m.x + (n.x - m.x) * (time - m.time) / (n.time - m.time)),
          y: (m.y + (n.y - m.y) * (time - m.time) / (n.time - m.time))
        }
      }
    })
    return pull(agents, null)
  }
)

/**
 * returns each agents approximated position at a given time,
 * given a list of markers in the format [agent_id, time, x, y]
 * list must be sorted first by agent_id and second by time
 */
const getAbsPositionsAnnotated = createSelector(
  [ videoRatio, markers, time], ( videoRatio, markers, time ) => {

    // adjust relative coordinates to preserve videos aspect ratio
    const { h_mult, h_offset, w_mult, w_offset } = getAdjustments(videoRatio)

    const pos = {};
    for(let i = 0; i< markers.length; i++){

      const m0 = markers[i]
      const m1 = markers[i + 1]

      // if end of markers reached or next marker belongs to another agent
      // set m1 to null;
      if(!m1 || m0[0] != m1[0]){
        // if current marker matches time set agents position accordingly
        if(!m1 && m0[1] == time) pos[m0[0]] = {
          x: w_offset + m0[2] * w_mult,
          y: h_offset + m0[3] * h_offset
        }
      }
      // if time is in between this and next marker we approximate the position
      else if(m0[1] <= time && time <= m1[1]) pos[m0[0]] = {
        x: w_offset + w_mult *
          (m0[2] + (m1[2] - m0[2]) * (time - m0[1]) / (m1[1] - m0[1])),
        y: h_offset + h_mult *
          (m0[3] + (m1[3] - m0[3]) * (time - m0[1]) / (m1[1] - m0[1]))
      }
    }
    return pos
  }
)

/**
 * returns each agents approximated position at a given time,
 * given a list of markers in the format [agent_id, time, x, y]
 * list must be sorted first by agent_id and second by time
 */
const getAbsPositionsSynthetic = createSelector(
  [ videoRatio, markers2, time], ( videoRatio, markers2, time ) => {
    if(!markers2) return null;

    // adjust relative coordinates to preserve videos aspect ratio
    const { h_mult, h_offset, w_mult, w_offset } = getAdjustments(videoRatio)

    const pos = {};
    for(let i = 0; i< markers2.length; i++){

      const m0 = markers2[i]
      const m1 = markers2[i + 1]

      // if end of markers reached or next marker belongs to another agent
      // set m1 to null;
      if(!m1 || m0[0] != m1[0]){
        // if current marker matches time set agents position accordingly
        if(!m1 && m0[1] == time) pos[m0[0]] = {
          x: w_offset + m0[2] * w_mult,
          y: h_offset + m0[3] * h_offset
        }
      }
      // if time is in between this and next marker we approximate the position
      else if(m0[1] <= time && time <= m1[1]) pos[m0[0]] = {
        x: w_offset + w_mult *
          (m0[2] + (m1[2] - m0[2]) * (time - m0[1]) / (m1[1] - m0[1])),
        y: h_offset + h_mult *
          (m0[3] + (m1[3] - m0[3]) * (time - m0[1]) / (m1[1] - m0[1]))
      }
    }
    return pos;
  }
);

( aspectratio ) => {

  let h_mult = 1, h_offset = 0, w_mult = 1, w_offset = 0;
  if (aspectratio >= 1) {
    h_mult = 1 / aspectratio
    h_offset = (1 - h_mult) / 2
  } else {
    w_mult = 1 / aspectratio
    w_offset = (1 - w_mult) / 2
  }
  return { h_mult, h_offset, w_mult, w_offset }
}

const getFrameConstraints = createSelector([ markers ], ( markers ) => {

  let left = 1, top = 1, right = 0, bottom = 0;

  for(let i = 0; i < markers.length; i++){
    if(markers[i][1] > 0) continue;

    if(markers[i][2] < left) left = markers[i][2]
    else if(markers[i][2] > right) right = markers[i][2]

    if(markers[i][3] < top) top = markers[i][3]
    else if(markers[i][3] > bottom) bottom = markers[i][3]
  }

  return {
    left,
    top,
    width: right - left,
    height: bottom - top
  }
})

const agentCount = createSelector([markers], markers => uniq(map(markers, m => m.agent)).length)

const overlayText = createSelector([overlay, overlays], (overlay, overlays) => {
  if (overlay == null) return 'none'
  if (overlay == 'white') return 'Black and White'
  return find(overlays, o => o.youtubeID == overlay).title
})

const roundedTime = createSelector([time], t => round(t, 3) || 0)

const youtubeID = createSelector([video], v => v ? v.youtubeID : null)

export default {
  agents,
  agentCount,
  agentSelected,
  channel,
  channelReady,
  error,
  convertToRel,
  duration,
  backwardPossible,
  forwardPossible,
  frameCSS,
  getAdjustments,
  getAbsPositionsAnnotated,
  getAbsPositionsSynthetic,
  getFrameConstraints,
  jumpTime,
  mode,
  overlay,
  sortedOverlays,
  overlayText,
  player,
  playerReady,
  playing,
  time: roundedTime,
  xRounded,
  yRounded,
  youtubeID
}
