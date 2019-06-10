/**
 * Protected Route
 * Wraps a Route and redirects to login, if user is not authentificated
 */

import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

const ProtectedRoute = ({ component, isAuthentificated, path, ...rest }) => (
  isAuthentificated
  ? <Route path={path} component={component} />
  : <Redirect to={{ pathname: '/login', state: { referrer: rest.location.pathname }}}/>
)

const mapStateToProps = ( store ) => ({ isAuthentificated: store.session.username != null })
export default withRouter(connect(mapStateToProps)(ProtectedRoute));
