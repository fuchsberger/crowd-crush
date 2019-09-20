import MainView from '../main'

export default class View extends MainView {
  mount() {
    super.mount()

    // const MainComponent = ({ ready }) => {
    //   // make sure public and user channels are ready
    //   if(!ready) return <Dimmer active inverted><Loader/></Dimmer>

    //   return(
    //     <Switch>
    //       <Route path="/" exact component={Pages.About} />
    //       <Route path="/about" component={Pages.About} />
    //       <Route path="/login" component={Pages.Login} />
    //       <Route path="/simulation/:id" component={Pages.Simulation} />
    //       <Route path="/videos" exact component={Pages.VideoList} />
    //       <Route path="/videos/:id" component={Pages.VideoShow} />

    //       {/* Private Routes (require login) */}
    //       <PRoute path="/video/add" component={Pages.VideoAdd} />
    //       <PRoute path="/settings" component={Pages.Settings} />

    //       {/* default 404 if no route matches*/}
    //       <Route component={Pages.Error} />
    //     </Switch>
    //   )
    // }

    // const mapStateToProps = ( store ) =>
    //   ({ ready: store.videos.data && (window.userToken === "" ? true : store.user != null) })
    // const Main = withRouter(connect(mapStateToProps)(MainComponent))

    // const RootHtml =
    //   <Provider store={ store }>
    //     <Router history={ history }>
    //       <Header />
    //       <Main />
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
    console.log('PageIndex mounted')
  }

  unmount() {
    super.unmount()
    console.log('PageIndex unmounted')
  }
}

