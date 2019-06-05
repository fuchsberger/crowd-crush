import { createSelector } from 'reselect'
import { addCoordRefPoints } from '../utils/simulation'

// this extension to the Object allows to filter a collection of objects
// (key = id) by a certain match function (predicate)
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter( key => predicate(obj[key]) )
    .reduce( (res, key) => (res[key] = obj[key], res), {} );

export const getVideoById = state =>
  state.videoList && state.simulation.video_id
    ? state.videoList[state.simulation.video_id ] || false
    : null;

// adds all calculations that are derived from the coordinate system to the vid
// only recalculates when video changes (performance)
export const getVideoWithCalcs = createSelector(
  [getVideoById],
  (video) => addCoordRefPoints(video)
);

export const getVisibleAgents = (agents, time) => {
  let visibleAgents = 0;
  Object.keys(agents).forEach(i => {
    if(agents[i].length >= 2 &&
      agents[i][0][0] <= time &&
      time <= agents[i][agents[i].length-1][0]
    ) visibleAgents++;
    else if (agents[i].length === 1 && agents[i][0][0] == time)
      visibleAgents++;
  })
  return visibleAgents;
};

export const listAllUsers = state => (
  Object.keys(state.userList).map(i => ({ ...state.userList[i], id: i }))
);

export const isUser = store => store.session.id
export const isAdmin = store => store.session.admin
export const modal = store => store.modal.modal
export const path = state => state.router.location.pathname

// simulation
export const isReadySimChannel = state =>
  state.api.simChannel && state.api.simChannel.state === 'joined'

export const isReadyPublicChannel = state =>
  state.api.publicChannel.state === 'joined'


export const markerCount = state => {
  const markers = state.simulation.markers
  return markers ? Object.keys(markers).length : null;
}

export const screenData = state => ({
  mouse_X:  state.ui.mouse_X,
  mouse_Y:  state.ui.mouse_Y,
  offset_X: state.ui.offset_X,
  offset_Y: state.ui.offset_Y,
  width:    state.ui.width,
  height:   state.ui.height
});
