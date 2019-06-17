import { filter } from 'lodash/collection'
import types from "./types"

const initialState = {
  data: null,
  sortColumn: 'title',
  sortDirection: 'asc'
}

export default function reducer(state = initialState, { type, columnName, video, videos }) {

  switch (type) {

    case types.ADD: return {...state, data: [ ...state.data, video ] }

    case types.LOAD:
      return {...state, data: state.data ? state.data.concat(videos) : videos }

    case types.MODIFY:
      return {...state, data: [ ...filter(state.data, v => (v.id != video.id)), video] }

    case types.SORT:
      if(columnName !== state.sortColumn)
        return {...state, sortColumn: columnName, sortDirection: 'asc' }

      return {
        ...state,
        sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
      }

    case types.UPDATE_ALL:
      nState = { ...state };
      videos.forEach(id => { delete nState[id] })
      return nState;

    default:
      return state;
  }
}
