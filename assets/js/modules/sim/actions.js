import types from "./types"
import { Utils } from '../../utils'

const join = (agents, channel) => ({ type: types.JOIN, agents, channel })

const joinError = () => ({ type: types.VIDEO_NOT_FOUND })
const leave = () => ({ type: types.LEAVE })

// Simulation
const hoverAgent = id => ({ type: types.HOVER_AGENT, id })
const clearError = () => ({ type: types.CLEAR_ERROR })
const error = () => ({ type: types.ERROR })

// heatmap

const createMap = map => ({ type: types.SET_HEATMAP, map })

// synthetic agents (create or move)
const spawn = robots => ({ type: types.SPAWN, robots })

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



const moveCursor = (x, y) => ({ type: types.MOVE_CURSOR, x, y })



const resize = () => ({ type: types.RESIZE })

const selectAgent = (agent = null) => ({ type: types.SELECT_AGENT, agent })

// Overlays
const addOverlay = overlay => ({ type: types.ADD_OVERLAY, overlay })
const removeOverlay = overlay => ({ type: types.REMOVE_OVERLAY, overlay })
const setOverlay = overlay => ({ type: types.SET_OVERLAY, overlay })

// markers
const setMarker = marker => ({ type: types.SET_MARKER, marker })
const removeMarkers = () => ({ type: types.REMOVE_MARKERS })

const update = params => ({ type: types.UPDATE, params })
const updateVideo = params => ({ type: types.UPDATE_VIDEO, params })

// HELPER FUNCTIONS
// calculates the appropriate size of the youtube player to match current screen size
const calc_player_size = video => {

  const window_ratio = window.innerWidth / (window.innerHeight - 40)

  if(video.aspectratio < window_ratio){
    video.height = window.innerHeight - 40
    video.width = Math.floor(video.height * video.aspectratio)
  } else {
    video.width = window.innerWidth
    video.height = Math.floor(video.width / video.aspectratio)
  }
  return video
}

export default {
  clearError,
  error,
  hoverAgent,
  join,
  joinError,

  leave,
  loadComparison,
  moveCursor,
  resize,
  selectAgent,

  // overlays
  addOverlay,
  removeOverlay,
  setOverlay,

  // markers
  setMarker,
  removeMarkers,

  update,
  updateVideo,

  // heatmap
  createMap,

  // synthetic agents
  spawn
};
