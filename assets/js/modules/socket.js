import { Socket } from 'phoenix'
import store from "../store"

// establish connection with server
const socket = new Socket('/socket', { params: { token: window.userToken }})
socket.connect()

export default socket

// load private channel on start
import configurePrivateChannel from './private_channel'
export const privateChannel = configurePrivateChannel(store.dispatch)
