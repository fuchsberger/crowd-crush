import types from "./types";

export default function reducer(state = null, { type, videos }) {
  switch (type) {
    case types.ALL:
      return state ? {...state, ...videos} : { ...videos }

    case types.UPDATE_ALL:
      nState = { ...state };
      videos.forEach(id => { delete nState[id] })
      return nState;

    default:
      return state;
  }
}