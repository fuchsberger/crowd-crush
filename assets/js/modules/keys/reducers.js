import types from "./types"

const initialState = {
  Q: false,
  W: false,
  E: false,
  A: false,
  S: false,
  D: false,
  Z: false,
  X: false,
  C: false,
  SHIFT: false,
  CTRL: false,
  SPACE: false
};

const reducer = (state = initialState, { type, key=null }) => {
  switch (type) {
    case types.DOWN:  return { ...state, [key]: true };
    case types.UP:    return { ...state, [key]: false };
    default:          return state;
  }
}

export default reducer;
