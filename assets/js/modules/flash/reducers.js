import types from "./types"

const reducer = (state = null, action) => {
  switch (action.type) {
    case types.CLEAR: return null;
    case types.ERROR: return { msg: action.msg, type: 'error' };
    case types.INFO: return { msg: action.msg, type: 'info' };
    default: return state;
  }
}

export default reducer;
