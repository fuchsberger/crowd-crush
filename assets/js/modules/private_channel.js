import socket from './socket'
import { flashOperations as Flash } from './flash'
import { sessionOperations as Session } from './session'

export default ( dispatch ) => {

  const channel = socket.channel('private')

  // ignore privateChannel when no valid token and return unjoined
  if(window.userToken === '') return channel

  // listen for events


  // join channel
  channel.join()
  .receive('ok', res => {
    dispatch(Session.login(res.username))
    dispatch(Flash.get(res))
  });

  return channel
}
