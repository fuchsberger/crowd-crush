import actions from "./actions"
import { flashOperations as Flash } from '../flash'

const login = actions.login

const updateAccount = ({ activeIndex, email, password, new_password, username }) => {
  return ( dispatch, store) => {
    dispatch(actions.startOperation())

    // send only relevant data to server
    let data
    switch(activeIndex){
      case 0: data = { username: username}; break;
      case 1: data = { email, password }; break;
      case 2: data = { new_password, password }
    }

    const uChannel = store().session.userChannel
    uChannel.push("update_account", data)
    .receive('ok', res => {
      dispatch(actions.updateAccount(res.username || null))
      dispatch(Flash.get(res))
    })
    .receive('error', ({ error }) => dispatch(actions.error(error)))
  }
}

export default {
  login,
  updateAccount
};
