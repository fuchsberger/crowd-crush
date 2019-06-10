import socket from './index'
import { flashOperations as Flash } from '../modules/flash'
import { sessionOperations as Session } from '../modules/session'

export default ( dispatch ) => {

  const channel = socket.channel('user')

  // ignore userChannel when no valid token and return unjoined
  if(window.userToken === '') return channel

  // Listen for events



  channel.join()
  .receive('ok', res => {
    dispatch(Session.login(res.username))
    dispatch(Flash.get(res))
  });

  return channel;
}
