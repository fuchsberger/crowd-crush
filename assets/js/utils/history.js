import { createBrowserHistory } from 'history'
import store from '../store'
import { flashOperations, flashSelectors as Flash } from '../modules/flash'

const history = createBrowserHistory()

let pathname = history.location.pathname

// check for redirect instructions as a result of a server load
const redirect = new URLSearchParams(history.location.search).get('redirect')
if(redirect) history.push(redirect)

// When a change in pathname is detected, dismiss an open message, if it exists.
history.listen((location) => {
  if (location.pathname != pathname && Flash.messageType(store.getState())){
    store.dispatch(flashOperations.clear())
    pathname = location.pathname
  }
});

export default history
