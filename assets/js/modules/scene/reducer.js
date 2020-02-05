import types from "./types"

const initialState = {
  youtubeID: null
}

const reducer = ( state = initialState, { type, ...payload } ) => {
  switch (type) {
    case types.LOAD:
      return payload.video

    default:
      return state
  }
}

export default reducer
