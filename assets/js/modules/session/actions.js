import types from "./types"

const change_username = username => ({ type: types.CHANGE_USERNAME, username })
const login = username => ({ type: types.LOGIN, username })

export default { change_username, login }
