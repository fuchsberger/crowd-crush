import { Socket } from 'phoenix';

export const socket = new Socket('/socket', { 
  params: { userToken: window.userToken }
})
socket.connect();