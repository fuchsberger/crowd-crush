import types from "./types"
import { Utils } from '../../utils'

const join = (video_id, channel, markers, overlays) => ({ type: types.JOIN, video_id, channel, markers, overlays })

const joinError = () => ({ type: types.VIDEO_NOT_FOUND })
const leave = () => ({ type: types.LEAVE })

const changeJumpInterval = time => ({ type: types.CHANGE_JUMP_INTERVAL, time })
const changeMode = mode => ({ type: types.CHANGE_MODE, mode })
const changePlayerState = () => ({ type: types.CHANGE_PLAYER_STATE })

const clearError = () => ({ type: types.CLEAR_ERROR })
const error = () => ({ type: types.ERROR })

const moveCursor = (x, y) => ({
  type: types.MOVE_CURSOR,
  cursorX: x,
  cursorY: y
})

const loadPlayer = player => ({ type: types.LOAD_PLAYER, player })

/**
 * Converts an array of absolute markers into an array of relative markers
 * @param {[]} markers Array with entries in format: [agent_id, time, x, y]
 */
const loadComparison = ( markers ) => {

  // markers are already sorted by time, now sort by agent first, then time
  markers = Utils.sortArrayByColumn(markers, 0);

  let west = 0, north=0, south=0, east=0;

  for(let i in markers){
    if(markers[i][2] < west) west = markers[i][2]
    if(markers[i][2] > east) east = markers[i][2]
    if(markers[i][3] < north) north = markers[i][3]
    if(markers[i][3] > south) south = markers[i][3]
  }

  const width = east - west;
  const height = south - north;

  for(let i in markers){
    markers[i][2] = (markers[i][2] - west) / width;
    markers[i][3] = (markers[i][3] - north) / height;
  }

  return { type: types.LOAD_COMPARISON, markers };
}

const jump = direction => ({ type: types.JUMP, direction })

const play = () => ({ type: types.PLAY })

const pause = () => {
  clearInterval(window.simTimer)
  return { type: types.PAUSE }
}

const resize = () => ({ type: types.RESIZE })

const stop = () => {
  clearInterval(window.simTimer)
  return { type: types.STOP }

}
const selectAgent = () => ({ type: types.SELECT_AGENT })

// Overlays
const addOverlay = overlay => ({ type: types.ADD_OVERLAY, overlay })
const removeOverlay = overlay => ({ type: types.REMOVE_OVERLAY, overlay })
const setOverlay = overlay => ({ type: types.SET_OVERLAY, overlay })

const tick = () => ({ type: types.TICK })
const update = params => ({ type: types.UPDATE, params })
const updateVideo = params => ({ type: types.UPDATE_VIDEO, params })

export default {
  changeJumpInterval,
  changeMode,
  changePlayerState,
  clearError,
  error,
  join,
  joinError,
  jump,
  leave,
  loadComparison,
  loadPlayer,
  moveCursor,
  play,
  pause,
  stop,
  resize,
  selectAgent,

  // overlays
  addOverlay,
  removeOverlay,
  setOverlay,

  tick,
  update,
  updateVideo
};
