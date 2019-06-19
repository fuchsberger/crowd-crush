import { createSelector } from 'reselect'

const error = state => state.sim.error
const markers = state => state.sim.markers
const markers2 = state => state.sim.markers2
const time = state => state.sim.time
const player = state => state.sim.player
const videoRatio = state => state.sim.video.aspectratio
const windowRatio = state => state.sim.windowRatio

const video_id = state => state.sim.video_id

// DERIVED DATA

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
const frameCSS = createSelector( [ player, videoRatio, windowRatio ],
  ( player, videoRatio ) => {
    let wDist = 0, hDist = 0;

    // get screen size, account for navbars on top and bottom
    const h = window.innerHeight - 110;
    const w = player ? window.innerWidth : window.innerWidth / 2

    // if screen is wider than video, center horizontally, otherwise vertically
    if (w / h > videoRatio) wDist = (w - videoRatio * h) / 2 / w;
    else hDist = (h - w / videoRatio) / 2 / h;

    if(wDist > hDist) return { left: wDist*100+"%", right: wDist*100+"%" }
    return { top: hDist*100+"%", bottom: hDist*100+"%" }
  }
);

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
const getRelPositions = createSelector(
  [ markers, time], ( markers, time ) => {

    const pos = {};
    for(let i = 0; i< markers.length; i++){

      const m0 = markers[i]
      const m1 = markers[i + 1]

      // if end of markers reached or next marker belongs to another agent
      // set m1 to null;
      if(!m1 || m0[0] != m1[0]){
        // if current marker matches time set agents position accordingly
        if(!m1 && m0[1] == time) pos[m0[0]] = { x: m0[2], y: m0[3] }
      }

      // if time is in between this and next marker we approximate the position
      else if(m0[1] <= time && time <= m1[1]) pos[m0[0]] = {
        x: (m0[2] + (m1[2] - m0[2]) * (time - m0[1]) / (m1[1] - m0[1])),
        y: (m0[3] + (m1[3] - m0[3]) * (time - m0[1]) / (m1[1] - m0[1]))
      }
    }
    return pos;
  }
);

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
    return pos;
  }
);

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

/**
 * Calculates the duration of the simulation, either from youtube video (sim),
 * or from markers (comparison)
 */
const duration = createSelector([ markers, player ], ( markers, player ) => {
  if( player ) return player.getDuration() * 1000;
  let duration = 0;
  if ( markers ) {
    for(let i = 0; i < markers.length; i++){
      if(markers[i][1] > duration) duration = markers[i][1];
    }
  }
  return duration;
});

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
});

const loading = createSelector([ error, video_id ], (error, video_id) => !error && !video_id)

const running = ( player ) => ( player && player.getPlayerState() == 1 )

export default {
  error,
  convertToRel,
  duration,
  frameCSS,
  getAdjustments,
  getRelPositions,
  getAbsPositionsAnnotated,
  getAbsPositionsSynthetic,
  getFrameConstraints,
  loading,
  video_id
};
