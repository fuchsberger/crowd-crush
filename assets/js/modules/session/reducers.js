import types from "./types"

const initialState = {
  error: null,
  socket: null,
  publicChannel: null,
  userChannel: null,
  user: null
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
    case types.INITIALIZE:
    case types.SIGNED_OUT:
      // payload contains: socket, publicChannel
      return { ...initialState, ...payload }

    case types.SIGNED_IN:
      // payload contains: socket, publicChannel, userChannel, user
      return {...payload, error: null};

    case types.SIGNIN_FAILED:
      return {...state, error: "Username / Password does not match." };

    case types.RESET_ERROR:
      return {...state, error: null };

    case types.UPDATE_ACCOUNT:
      return {...state, user: payload.user };

    default:
      return state;
  }
}
