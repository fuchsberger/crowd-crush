import CSS from '../css/app.css'

import React from 'react'
import { render } from "react-dom"
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import socket from './api' // do not delete!
import store from "./store"
import { Flash, Header, Loading, PRoute, Referrer } from "./components"
import Pages from "./pages"
import { simOperations as Sim } from "./modules/sim"

const Router = ({ ready }) => {
  // make sure public and user channels are ready
  if(!ready) return <Loading />

  return(
    <Switch>
      <Route path="/about" component={Pages.About} />
      <Route path="/login" component={Pages.Login} />
      <Route path="/simulation/:id" component={Pages.SimulationShow} />
      <Route path="/videos" exact component={Pages.VideoList} />
      <Route path="/videos/:id" component={Pages.VideoShow} />

      {/* Private Routes (require login) */}
      <PRoute path="/video/add" component={Pages.VideoAddView} />
      <PRoute path="/settings" component={Pages.Settings} />

      {/* default 404 if no route matches*/}
      <Route component={Pages.Error} />
    </Switch>
  )
}

const mapStateToProps = ( store ) => ({
  ready: store.videos.data && (window.userToken === "" ? true : store.session.username != null)
})
const AuthenticatedRouter = withRouter(connect(mapStateToProps)(Router))

const RootHtml =
  <Provider store={ store }>
    <BrowserRouter>
      <Referrer />
      <Header />
      <Flash />
      <AuthenticatedRouter />
    </BrowserRouter>
  </Provider>

// render react app
render(RootHtml, document.getElementById( "react-root" ) );

// listen for window resizes
let resizeTimeout;
const resize = () => store.dispatch(Sim.resize())
window.addEventListener("resize", () => {
  if(!!resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 200);
});
