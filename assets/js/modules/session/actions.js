import types from "./types"

const startOperation = () => ({ type: types.START_OPERATION })

const login = username => ({ type: types.LOGIN, username })

const initialize = (socket, publicChannel, signout=false) => ({
  type: signout ? types.SIGNED_OUT : types.INITIALIZE,
  socket,
  publicChannel
});

const signinSuccess = (socket, publicChannel, userChannel, username) => ({
  type: types.SIGNED_IN,
  socket,
  publicChannel,
  userChannel,
  username
});

const error = error => ({ error, type: types.ERROR })

const resetError = () => ({ type: types.RESET_ERROR })

const updateAccount = ( username = null ) => ({ type: types.UPDATE_ACCOUNT, username })

export default {
  error,
  login,
  initialize,
  startOperation,
  signinSuccess,
  resetError,
  updateAccount
};
