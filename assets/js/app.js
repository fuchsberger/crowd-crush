// CSS imports
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/semantic-ui-css/semantic.css"
import CSS from '../css/app.css'

// Javascript imports
import { render } from "react-dom"
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { Provider } from "react-redux"
import store from "./store"
import { Flash, Footer, Header, PRoute } from "./components"
import Pages from "./pages"
import { sessionOperations as Session } from "./modules/session"
import { simOperations as Sim } from "./modules/sim"

const RootHtml = ( ) => (
  <Provider store={ store }>
    <BrowserRouter>
      <div>
        <Header />
        <Flash />
        <Switch>
          <Route path="/" exact render={() => (<Redirect to="/videos"/>)} />
          <Route path="/about" component={Pages.About} />
          <Route path="/login" component={Pages.Login} />
          <Route path="/simulation/:id" component={Pages.SimulationShow} />
          <Route path="/videos" exact component={Pages.VideoList} />
          <Route path="/videos/:id" component={Pages.VideoShow} />
          {/*
          <Route path="/video/add" component={VideoAddView} />
          */}

          {/* Private Routes (require login) */}
          <PRoute path="/settings" component={Pages.Settings} />

          {/* default 404 if no route matches*/}
          <Route component={Pages.Error} />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>
);

// render react app
render( <RootHtml />, document.getElementById( "react-root" ) );

// listen for window resizes
let resizeTimeout;
const resize = () => store.dispatch(Sim.resize())
window.addEventListener("resize", () => {
  if(!!resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 200);
});

// initialize socket
store.dispatch(Session.initialize());
