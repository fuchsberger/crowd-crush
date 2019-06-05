// Action Types
const DELETE_AGENT = 'crowd-crush/simulation/DELETE_AGENT'
const DELETE_ALL_AGENTS = 'crowd-crush/simulation/DELETE_ALL_AGENTS'
const DELETE_OVERLAY = 'crowd-crush/simulation/DELETE_OVERLAY'

export default function reducer(state = initialState, {type, ...params}) {
  switch (type) {

    case DELETE_AGENT:
      const agent_id = params.agent_id;
      const { markers, agent_hovered, agent_selected } = state
      return {
        ...state,
        agent_hovered: agent_hovered === agent_id ? null : agent_hovered,
        agent_selected: agent_selected === agent_id ? null : agent_hovered,
        markers: Object.filter(markers, m => m.agent !== agent_id)
      }

    case DELETE_ALL_AGENTS:
      return {
        ...state,
        markers: {},
        agent_hovered: null,
        agent_selected: null
      };

    case DELETE_OVERLAY:
      return {
        ...state,
        overlays: [
          ...state.overlays.filter(o => o.youtubeID !== params.youtubeID)
        ]
      };

    default: return state;
  }
}

// Async Actions

export const addOverlay = overlay => {
  return (dispatch, store) => {
    store().simulation.channel.push('set_overlay', overlay);
  }
}

export const deleteOverlay = youtubeID => {
  return (_dispatch, store) => {
    store().simulation.channel.push('delete-overlay', { youtubeID });
  }
}

export const removeAgent = id => {
  return (dispatch, store) => {
    store().simulation.channel.push('remove_agent', { id });
    dispatch({
      type: UPDATE,
      agent_hovered: null,
      agent_selected: null
    });
  }
}

export const removeAllAgents = () => {
  return (dispatch, store) => {
    store().simulation.channel.push('remove_all_agents');
    dispatch({
      type: UPDATE,
      agent_hovered: null,
      agent_selected: null
    });
  }
}

export const updateVideo = payload => {
  return (_dispatch, store) =>
    store().simulation.channel.push('update_video', payload);
}
