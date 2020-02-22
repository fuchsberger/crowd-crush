import types from "./types"

const login = username => ({ type: types.LOGIN, username })

export default { change_username, login }
