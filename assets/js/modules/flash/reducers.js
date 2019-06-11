import types from "./types"

const initialState = { message: null, type: null }

const reducer = (state = initialState, {type, message}) => {
  switch (type) {
    case types.CLEAR: return initialState
    case types.ERROR: return { message, type: 'error' }
    case types.INFO: return { message, type: 'info' }
    case types.SUCCESS: return { message, type: 'success' }
    case types.WARNING: return { message, type: 'warning' }
    default: return state;
  }
}

export default reducer
