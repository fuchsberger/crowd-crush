import CSS from '../css/app.scss'

import 'popper.js'
import 'bootstrap'
import 'phoenix_html'
import { Socket } from "phoenix"
import LiveSocket from "phoenix_live_view"
import Hooks from './hooks'

// if we do have a crsf token (all pages except error pages)
// then connect live socket and enable various functionalities
const csrf_elm = document.querySelector("meta[name='csrf-token']")
if(csrf_elm){
  const _csrf_token = csrf_elm.getAttribute("content")
  let liveSocket = new LiveSocket("/live", Socket, { hooks: Hooks, params: { _csrf_token } })
  liveSocket.socket.onError(() => $('#loader-wrapper').show())
  liveSocket.connect()
}

// REACT APP
// import socket from './modules/socket' // do not delete!
// import React from 'react'
// import { render } from "react-dom"
// import { Route, Router, Switch } from 'react-router-dom'
// import { Provider } from "react-redux"
// import store from "./store"
// import { flashOperations } from './modules/flash'
// import { DefaultMenu, SimMenu } from './components'
// import Pages from "./pages"
// import { simOperations as Sim } from "./modules/sim"

// import { history } from './utils'

// const RootHtml =
//   <Provider store={ store }>
//     <Router history={history}>
//       <Switch>
//         <Route path="/scene/:id/:action" component={SimMenu} />
//         <Route component={DefaultMenu} />
//       </Switch>
//       <Switch>
//         <Route path="/" exact component={Pages.About} />
//         <Route path="/scene/:id/:action" component={Pages.Scene} />
//         <Route path="/videos/:id" component={Pages.VideoShow} />

//         {/* default 404 if no route matches*/}
//         <Route component={Pages.Error} />
//       </Switch>
//     </Router>
//   </Provider>

// // render react app
// let container = document.getElementById( "react-root" )
// if(container) {

//   render(RootHtml, container);

//   // initially check for server flash messages to display
//   store.dispatch(flashOperations.get(window.flash))

//   // listen for window resizes
//   let resizeTimeout;
//   const resize = () => store.dispatch(Sim.resize())
//   window.addEventListener("resize", () => {
//     if(!!resizeTimeout) clearTimeout(resizeTimeout);
//     resizeTimeout = setTimeout(resize, 200);
//   });
// }
