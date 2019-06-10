import actions from "./actions"
import { userChannel } from '../../api'
import { flashOperations as Flash } from '../flash'

const login = actions.login

const updateAccount = (data) => {
  return ( dispatch ) => {
    dispatch(actions.startOperation())

    userChannel.push("update_account", data)
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
