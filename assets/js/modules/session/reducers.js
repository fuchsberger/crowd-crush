import types from "./types"

const initialState = {
  error: null,
  loading: true,
  socket: null,
  publicChannel: null,
  userChannel: null,
  username: null
};

/**
 * INITIALIZE - we joined socket anonymously and open public channel
 * SIGNED_IN - we joined with token and open public and user channel, set user
 * SIGNED_OUT - we signed out -> do initialize again
 * SIGNIN_FAILED - we failed to authenticate -> show error and stay anonymous
 * RESET_ERROR - we leave sign_in page (when error was present) -> reset error
 */

export default function reducer(state = initialState, {type, ...payload}) {
  switch (type) {
    case types.START_OPERATION: return { ...state, loading: true }

    case types.INITIALIZE:
    case types.SIGNED_OUT:
      // payload contains: socket, publicChannel
      return { ...initialState, ...payload, loading: false }

    case types.SIGNED_IN:
      // payload contains: socket, publicChannel, userChannel, user
      return {...payload, error: null, loading: false};

    case types.SIGNIN_FAILED:
      return {...state, error: true, loading: false };

    case types.RESET_ERROR:
      return {...state, error: null, loading: false };

    case types.UPDATE_ACCOUNT:
      return {...state, username: payload.username || state.username, loading: false };

    default:
      return state;
  }
}
