// import { filter, includes, map, reject } from 'lodash/collection'
import types from "./types"

 const reducer = (state = null, {type, ...payload}) => {

  switch (type) {

    // case types.ADD: return {...state, pay }

    case types.LOAD:
      return payload.videos

    // case types.MODIFY:
    //   return {...state, data: [ ...filter(state.data, v => (v.id != video.id)), video] }

    // case types.REMOVE:
    //     return {...state, data: reject(state.data, v => v.id == id ) }

    // case types.UPDATE_ALL:
    //   nState = { ...state };
    //   videos.forEach(id => { delete nState[id] })
    //   return nState;

    default:
      return state;
  }
}

export default reducer
