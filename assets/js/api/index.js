import { Socket } from 'phoenix'
import store from "../store"

// establish connection with server
const socket = new Socket('/socket', { params: { token: window.userToken }})
socket.connect()

export default socket

// load public and user channels on start
import configurePublicChannel from './public'
import configureUserChannel from './user'

export const publicChannel = configurePublicChannel(store.dispatch)
export const userChannel = configureUserChannel(store.dispatch)
