import CSS from '../css/app.css'

import socket from './api' // do not delete!
import React from 'react'
import { render } from "react-dom"
import { connect } from 'react-redux'
import { Route, Router, Switch, withRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import store from "./store"
import { Header, PRoute } from "./components"
import { flashOperations } from './modules/flash'
import Pages from "./pages"
import { simOperations as Sim } from "./modules/sim"

import { history } from './utils'

const MainComponent = ({ ready, location }) => {
  // make sure public and user channels are ready
  if(!ready) return <div id="spinner-wrapper"><div id="spinner" /></div>

  return(
    <Switch>
      <Route path="/" exact component={Pages.About} />
      <Route path="/about" component={Pages.About} />
      <Route path="/login" component={Pages.Login} />
      <Route path="/simulation/:id" component={Pages.SimulationShow} />
      <Route path="/videos" exact component={Pages.VideoList} />
      <Route path="/videos/:id" component={Pages.VideoShow} />

      {/* Private Routes (require login) */}
      <PRoute path="/video/add" component={Pages.VideoAddView} />
      <PRoute path="/settings" component={Pages.Settings} />

      {/* default 404 if no route matches*/}
      <Route component={Pages.Error} pathname={location.pathname} />
    </Switch>
  )
}

const mapStateToProps = ( store ) => ({
  ready: store.videos.data && (window.userToken === "" ? true : store.session.username != null)
})
const Main = withRouter(connect(mapStateToProps)(MainComponent))

const RootHtml =
  <Provider store={ store }>
    <Router history={ history }>
      <Header />
      <Main />
    </Router>
  </Provider>

// render react app
render(RootHtml, document.getElementById( "react-root" ) );

// initially check for server flash messages to display
store.dispatch(flashOperations.get(window.flash))

// listen for window resizes
let resizeTimeout;
const resize = () => store.dispatch(Sim.resize())
window.addEventListener("resize", () => {
  if(!!resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 200);
});
