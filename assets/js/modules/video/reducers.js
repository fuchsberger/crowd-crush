import types from "./types"

const initialState = {
  data: null,
  sortColumn: 'title',
  sortDirection: 'ascending'
}

export default function reducer(state = initialState, { type, columnName, videos }) {
  switch (type) {

    case types.LOAD:
      return {...state, data: state.data ? state.data.concat(videos) : videos }

    case types.SORT:
      if(columnName !== state.sortColumn)
        return {...state, sortColumn: columnName, sortDirection: 'ascending' }

      return {
        ...state,
        sortDirection: state.sortDirection === 'ascending' ? 'descending' : 'ascending'
      }

    case types.UPDATE_ALL:
      nState = { ...state };
      videos.forEach(id => { delete nState[id] })
      return nState;

    default:
      return state;
  }
}
