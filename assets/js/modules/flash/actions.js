import types from "./types"

const clear = () => ({ type: types.CLEAR })
const error = message => ({ type: types.ERROR, message })
const info = message => ({ type: types.INFO, message })
const success = message => ({ type: types.SUCCESS, message })
const warning = message => ({ type: types.WARNING, message })

export default { clear, error, info, success, warning }
