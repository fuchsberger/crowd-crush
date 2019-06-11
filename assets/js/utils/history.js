import { createBrowserHistory } from 'history'
import store from '../store'
import { flashOperations, flashSelectors as Flash } from '../modules/flash'

const history = createBrowserHistory()

let pathname = history.location.pathname

// check for redirect as a result of an unsucessful login (forward redirect path)
if(window.redirect) history.push({ pathname: '/login', state: { redirect: window.redirect }})

// check for redirect as a result of a successful login
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
