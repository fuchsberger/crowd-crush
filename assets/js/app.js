import CSS from '../css/app.css'

import socket from './modules/socket' // do not delete!
import React from 'react'
import { render } from "react-dom"
import { connect } from 'react-redux'
import { Route, Router, Switch, withRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import { Dimmer, Loader } from 'semantic-ui-react'
import store from "./store"
import { PRoute } from "./components"
import { flashOperations } from './modules/flash'
import { DefaultMenu, SimMenu } from './components/menus'
import Pages from "./pages"
import { simOperations as Sim } from "./modules/sim"

import { history } from './utils'

const MainComponent = ({ ready }) => {
  // make sure public and user channels are ready
  if(!ready) return <Dimmer active inverted><Loader/></Dimmer>

  return(
    <Switch>
      <Route path="/" exact component={Pages.About} />
      <Route path="/about" component={Pages.About} />
      <Route path="/login" component={Pages.Login} />
      <Route path="/simulation/:id" component={Pages.Simulation} />
      <Route path="/videos" exact component={Pages.VideoList} />
      <Route path="/videos/:id" component={Pages.VideoShow} />

      {/* Private Routes (require login) */}
      <PRoute path="/video/add" component={Pages.VideoAdd} />
      <PRoute path="/settings" component={Pages.Settings} />

      {/* default 404 if no route matches*/}
      <Route component={Pages.Error} />
    </Switch>
  )
}

const mapStateToProps = ( store ) =>
  ({ ready: store.videos.data && (window.userToken === "" ? true : store.user != null) })
const Main = withRouter(connect(mapStateToProps)(MainComponent))

const RootHtml =
  <Provider store={ store }>
    <Router history={history}>
      <Switch>
        <Route path="/simulation/:id" component={SimMenu} />
        <Route component={DefaultMenu} />
      </Switch>
      <Main />
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

import loadView from './views/loader'

function handleDOMContentLoaded() {
  const viewName = document.getElementsByTagName('body')[0].dataset.jsFile
  const view = loadView(viewName)
  view.mount()
  window.currentView = view
}

function handleDocumentUnload() {
  window.currentView.unmount()
}

window.addEventListener('DOMContentLoaded', handleDOMContentLoaded, false);
window.addEventListener('unload', handleDocumentUnload, false);
