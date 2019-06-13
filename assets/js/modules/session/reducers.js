import types from "./types"

export default function reducer(state = null, { type, username }) {
  switch (type) {
    case types.CHANGE_USERNAME:
    case types.LOGIN:
      return username

    default: return state;
  }
}
