import { Socket } from 'phoenix'
import actions from "./actions"
import { Api, Utils } from '../../utils'
import { flashOperations as Flash } from '../flash'
import { videoOperations as Video } from '../video'

/**
 * Connects to socket and channels depending on:
 * if token present and valid --> dispatches signedIn()
 * if token present and invalid --> deletes token and calls itself again
 * if no token -> dispatches initialize()
 *
 * @param signOut this will change action.type to LOGOUT instead of INITIALIZE
 */
const initialize = (signOut = false) => {
  return dispatch => {

    // establish socket with auth token (if present)
    const token = localStorage.getItem('user_token')

    const socket = new Socket('/socket', { params: token ? { token } : {} });

    // if trying to connect and there was an error (such as invalid token),
    // delete token and try again (anonymous)
    socket.onError( () => {
      if(localStorage.getItem('user_token')){
        localStorage.removeItem('user_token')
        dispatch(initialize())
      }
    })

    socket.connect();

    const pChannel = Api.configPublicChannel(socket, dispatch);

    if (pChannel.state != 'joined') {
      pChannel
        .join()
        .receive('ok', ({ last_updated, videos }) => {
          pChannel.params.last_updated = last_updated;
          dispatch(Video.all(videos));
        });
    }

    if(token){
      const uChannel = Api.configUserChannel(socket, dispatch)
      if (uChannel.state != 'joined')
        uChannel.join()
        .receive('ok', ({ username }) =>
          dispatch(actions.signinSuccess(socket, pChannel, uChannel, username)));
    }
    else dispatch(actions.initialize(socket, pChannel, signOut))
  }
}

const signIn = (params, redirect) => {
  return ( dispatch ) => {
    dispatch(actions.startOperation())

    Utils.httpPost('/login', { session: params })
    .then((response) => {
      localStorage.setItem('user_token', response.user_token);
      dispatch(initialize())
      redirect('/videos')
    })
    .catch(() => dispatch(actions.error(true)));
  };
}

const signOut = ( redirect ) => {
  return dispatch => {
    Utils.httpDelete('/login') // delete session on server as well
    localStorage.removeItem('user_token')
    dispatch(initialize(true))
    redirect('/login')
  };
};

const updateAccount = ({ activeIndex, email, password, new_password, username }) => {
  return ( dispatch, store) => {
    dispatch(actions.startOperation())

    // send only relevant data to server
    let data
    switch(activeIndex){
      case 0: data = { username: username}; break;
      case 1: data = { email, password }; break;
      case 2: data = { new_password, password }
    }

    const uChannel = store().session.userChannel
    uChannel.push("update_account", data)
    .receive('ok', res => {
      dispatch(actions.updateAccount(res.username || null))
      dispatch(Flash.get(res))
    })
    .receive('error', ({ error }) => dispatch(actions.error(error)))
  }
}

export default {
  initialize,
  signIn,
  signOut,
  updateAccount
};
