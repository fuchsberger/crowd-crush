import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from "react-router-dom"

/**
 * Protected Route
 * Wraps a Route and redirects to login, if user is not authentificated
 */

const PRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('phoenixAuthToken') ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/sign_in',
        state: {
          error: "Please authenticate.",
          from: rest.location.pathname
        }
      }}/>
    )
  )}/>
)

const mapStateToProps = ( store ) => ({
  isAuthentificated: !!store.session.user,
});

export default withRouter(connect(mapStateToProps)(PRoute));
