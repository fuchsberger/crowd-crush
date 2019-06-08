import types from "./types"

const baseState = {
  dismissed: true,
  error: false,
  info: false,
  warning: false,
  success: false,
  header: null,
  content: null
};

const reducer = (state = baseState, {type, header, content}) => {
  switch (type) {
    case types.CLEAR: return { ...state, dismissed: true }
    case types.ERROR: return { ...baseState, header, content, dismissed: false, error: true }
    case types.INFO: return { ...baseState, header, content, dismissed: false, info: true }
    case types.SUCCESS: return { ...baseState, header, content, dismissed: false, success: true }
    case types.WARNING: return { ...baseState, header, content, dismissed: false, warning: true }
    default: return state;
  }
}

export default reducer;
