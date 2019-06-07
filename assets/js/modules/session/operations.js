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
        .receive('ok', ({ user }) =>
          dispatch(actions.signinSuccess(socket, pChannel, uChannel, user)));
    }
    else dispatch(actions.initialize(socket, pChannel, signOut))
  }
}

const signIn = (params, redirect) => {
  return ( dispatch ) => {
    const data = { session: params };
    Utils.httpPost('/login', data)
    .then((response) => {
      localStorage.setItem('user_token', response.user_token);
      dispatch(initialize())
      redirect('/videos')
    })
    .catch((error) => {
      error.response.json()
      .then((errorJSON) => {
        // dispatch(actions.signinFailed(errorJSON.error));
      });
    });
  };
}

const signOut = ( redirect ) => {
  return dispatch => {
    localStorage.removeItem('user_token');
    dispatch(initialize(true));
    redirect('/login')
  };
};

const updateAccount = ({ confirm_password, ...data }) => {
  return ( dispatch, store) => {
    const uChannel = store().session.userChannel
    uChannel.push("update_account", data)
    .receive('ok', ({ user }) => {
      dispatch(actions.updateAccount(user))
      dispatch(Flash.info("You account was successfully updated!"))
    })
    .receive('error', ({ error }) => console.log(error))
  }
}

export default {
  initialize,
  signIn,
  signOut,
  updateAccount
};
