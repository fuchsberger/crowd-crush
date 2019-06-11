import actions from "./actions"

const clear = actions.clear

// Takes a channel server response or initial flash and looks for flash message indicators.
// Also clears a previously active flash message.
const get = ({ error=false, info=false, success=false, warning=false }) => {
  return dispatch => {
    if(error) return dispatch(actions.error(error))
    if(info) return dispatch(actions.info(info))
    if(success) return dispatch(actions.success(success))
    if(warning) return dispatch(actions.warning(warning))
  }
}

export default { get, clear }
