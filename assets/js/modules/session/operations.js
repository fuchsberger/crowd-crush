import actions from "./actions"
import { privateChannel } from '../socket'
import { start_request } from '../loading'
import { flashOperations as Flash } from '../flash'

const login = actions.login

const changeUsername = username => {
  return ( dispatch ) => {
    dispatch(start_request())

    privateChannel.push("change_username", username)
    .receive('ok', res => {
      dispatch(actions.change_username(res.username))
      dispatch(Flash.get(res))
    })
    .receive('error', res => dispatch(Flash.get(res)))
  }
}

const updateAccount = (data) => {
  return ( dispatch ) => {
    dispatch(start_request())

    privateChannel.push("update_account", data)
    .receive('ok', res => dispatch(Flash.get(res)))
    .receive('error', res => dispatch(Flash.get(res)))
  }
}

export default {
  changeUsername,
  login,
  updateAccount
};
