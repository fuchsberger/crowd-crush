import types from "./types"

const initialize = (socket, publicChannel, signout=false) => ({
  type: signout ? types.SIGNED_OUT : types.INITIALIZE,
  socket,
  publicChannel
});

const signinSuccess = (socket, publicChannel, userChannel, user) => ({
  type: types.SIGNED_IN,
  socket,
  publicChannel,
  userChannel,
  user
});

const signinFailed = () => ({ type: types.SIGNIN_FAILED });

const resetError = () => ({ type: types.RESET_ERROR });

const updateAccount = ( user ) => ({ type: types.UPDATE_ACCOUNT, user })

export default {
  initialize,
  signinSuccess,
  signinFailed,
  resetError,
  updateAccount
};