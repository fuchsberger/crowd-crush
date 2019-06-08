import actions from "./actions"

// Takes a channel server response and looks for flash message indicators.
// Also clears a previously active flash message.
const get = ({ error=false, info=false, success=false, warning=false }) => {
  return dispatch => {
    if(error) return dispatch(actions.error(error))
    if(info) return dispatch(actions.info(info))
    if(success) return dispatch(actions.success(success))
    if(warning) return dispatch(actions.warning(warning))
  };
};

// Clears the currently active flash message.
const clear = () => (dispatch => dispatch(actions.clear()))

export default { get, clear };
