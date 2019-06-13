import types from '../flash/types'

const REQUEST_STARTED = 'api/REQUEST_STARTED'
const REQUEST_COMPLETE = 'api/REQUEST_COMPLETE'

const reducer = (state = false, { type }) => {
  switch (type) {
    case REQUEST_STARTED: return true
    case REQUEST_COMPLETE: return false

    // also disable loading when a flash message was produced
    // (usually when receiving server response)
    case types.CLEAR:
    case types.ERROR:
    case types.INFO:
    case types.WARNING:
    case types.GET:
      return false

    default: return state;
  }
}

export const start_request = () => ({ type: REQUEST_STARTED })
export const complete_request = () => ({ type: REQUEST_COMPLETE })

export default reducer
