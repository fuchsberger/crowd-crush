import actions from "./actions"
import { privateChannel } from '../'
import { flashOperations as Flash } from '../flash'

const login = actions.login

const updateAccount = (data) => {
  return ( dispatch ) => {
    dispatch(actions.startOperation())

    privateChannel.push("update_account", data)
    .receive('ok', res => {
      if(res.username) dispatch(actions.login(res.username))
      dispatch(Flash.get(res))
    })
    .receive('error', ({ error }) => dispatch(actions.error(error)))
  }
}

export default {
  login,
  updateAccount
};
