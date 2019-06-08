import types from "./types"

const clear = () => ({ type: types.CLEAR })

const error = ( content, header="An Error Occurred!" ) => ({ type: types.ERROR, header, content })
const info = ( content, header="Please note:" ) => ({ type: types.INFO, header, content })
const success = (content, header="Success!" ) => ({ type: types.SUCCESS, header, content })
const warning = ( content, header="Warning:" ) => ({ type: types.WARNING, header, content })

export default { clear, error, info, success, warning };
