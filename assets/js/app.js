import CSS from '../css/app.css'

import socket from './modules/socket' // do not delete!
import React from 'react'
import { render } from "react-dom"
import { Route, Router, Switch } from 'react-router-dom'
import { Provider } from "react-redux"
import store from "./store"
import { PRoute } from "./components"
import { flashOperations } from './modules/flash'
import { DefaultMenu, SimMenu } from './components'
import Pages from "./pages"
import { simOperations as Sim } from "./modules/sim"

import { history } from './utils'

const RootHtml =
  <Provider store={ store }>
    <Router history={history}>
      <Switch>
        <Route path="/scene/:id/:action" component={SimMenu} />
        <Route component={DefaultMenu} />
      </Switch>
      <Switch>
        <Route path="/" exact component={Pages.About} />
        <Route path="/about" component={Pages.About} />
        <Route path="/login" component={Pages.Login} />
        <Route path="/scene/:id/:action" component={Pages.Scene} />
        <Route path="/videos" exact component={Pages.VideoList} />
        <Route path="/videos/:id" component={Pages.VideoShow} />

        {/* Private Routes (require login) */}
        <PRoute path="/video/add" component={Pages.VideoAdd} />
        <PRoute path="/settings" component={Pages.Settings} />

        {/* default 404 if no route matches*/}
        <Route component={Pages.Error} />
      </Switch>
    </Router>
  </Provider>

// render react app
let container = document.getElementById( "react-root" )
if(container) {

  render(RootHtml, container);

  // initially check for server flash messages to display
  store.dispatch(flashOperations.get(window.flash))

  // listen for window resizes
  let resizeTimeout;
  const resize = () => store.dispatch(Sim.resize())
  window.addEventListener("resize", () => {
    if(!!resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
  });
}

// import loadView from './views/loader'

// function handleDOMContentLoaded() {
//   const viewName = document.getElementsByTagName('body')[0].dataset.jsFile
//   const view = loadView(viewName)
//   view.mount()
//   window.currentView = view
// }

// function handleDocumentUnload() {
//   window.currentView.unmount()
// }

// window.addEventListener('DOMContentLoaded', handleDOMContentLoaded, false);
// window.addEventListener('unload', handleDocumentUnload, false);
