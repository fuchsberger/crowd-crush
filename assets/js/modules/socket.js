import { Socket } from 'phoenix'
import store from "../store"

// establish connection with server
const socket = new Socket('/socket', { params: { token: window.userToken }})
socket.connect()

export default socket

// load public and user channels on start
import configurePublicChannel from './public_channel'
import configurePrivateChannel from './private_channel'

export const publicChannel = configurePublicChannel(store.dispatch)
export const privateChannel = configurePrivateChannel(store.dispatch)
