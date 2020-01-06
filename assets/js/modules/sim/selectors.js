import { createSelector } from 'reselect'
import { filter, find, map, sortBy } from 'lodash/collection'
import { round } from 'lodash/math'

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

const video = state => state.sim.video
const video_id = createSelector([ video ], v => v != null ? v.id : null )
const video_duration = createSelector([ video ], v => v != null ? v.duration : null)
const video_height = createSelector([ video ], v => v != null ? v.height : window.innerHeight-40)
const video_width = createSelector([ video ], v => v != null ? v.width : window.innerWidth)

// DERIVED DATA

const xRounded = createSelector([x], x => x == null ? '-- x --' : round(x, 3))
const yRounded = createSelector([y], y => y == null ? '-- y --' : round(y, 3))

const channelReady = createSelector([video_id], id => id != null)

const backwardPossible = createSelector([jumpTime, time], (j, t) => t - j >= 0 ? true : false)
const forwardPossible = createSelector([ video_duration, jumpTime, time ],
  (d, j, t) => t + j <= d ? true : false)

const sortedOverlays = createSelector([ overlays ], overlays => sortBy(overlays, 'title'))

/**
 * Gets the positions of markers in heatmap format
 */
const mappedMarkers = createSelector([mode, markers], (mode, markers) => {
  if(mode == 'mapStart') markers = filter(markers, { time: 0 })
  else return null

  return map(markers, m => ({
    x: parseInt(m.x * window.innerHeight),
    y: parseInt(m.y * window.innerHeight),
    value: 80
  }))
})

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
 * @param {number} videoRatio
 * @param {number} windowRatio
 */
const frameCSS = createSelector( [ video_height, video_width ], ( h, w ) => {

    let wDist = 0, hDist = 0;

    // get screen size, account for navbar on top
    w = player ? window.innerWidth : window.innerWidth / 2

    // if screen is wider than video, center horizontally, otherwise vertically
    if (w / h > videoRatio) wDist = (w - videoRatio * h) / 2 / w;
    else hDist = (h - w / videoRatio) / 2 / h;

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
 * Returns each agents approximated position at a given time.
 * Markers are already grouped and sorted (server side)
 */
const agents = createSelector(
  [ video, time], ( video, time ) => {
    let agents = []

    for (let [agent, markers] of Object.entries(video.agents)) {
      for(let i = 0; i < markers.length; i++){
        const curr = markers[i]

        // if current time matches an agents markers time exactly show agent
        if(curr[0] == time){
          agents.push({ id: agent, x: curr[1], y: curr[2] })
          break
        }

        // end of line reached / only one marker (at different time) --> do not show agent
        if(i+1 == markers.length) break

        // if time is in between this and next marker we approximate the position
        const next = markers[i+1]
        if(curr[0] <= time && time <= next[0]){
          let percentage = (time - curr[0]) / (next[0] - curr[0]) * 1000

          agents.push({
            id: agent,
            x: (curr[1] + (next[1] - curr[1]) * percentage),
            y: (curr[2] + (next[2] - curr[2]) * percentage)
          })
          break
        }
      }
    }
    return agents
  }
)

/**
 * Returns the number of agents the simulation has.
 */
const agentCount = createSelector([video], v => Object.keys(v.agents).length)

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
  backwardPossible,
  forwardPossible,
  frameCSS,
  getAdjustments,
  getAbsPositionsAnnotated,
  getAbsPositionsSynthetic,
  getFrameConstraints,
  jumpTime,
  mode,
  mappedMarkers,
  overlay,
  sortedOverlays,
  overlayText,
  player,
  playerReady,
  playing,
  time: roundedTime,
  video_id,
  video_duration,
  video_height,
  video_width,
  xRounded,
  yRounded,
  youtubeID
}
