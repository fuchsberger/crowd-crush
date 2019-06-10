/**
 * Protected Route
 * Wraps a Route and redirects to login, if user is not authentificated
 */
import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

const EnhanchedRoute = ({ component, isAuthentificated, location, path }) => (
  isAuthentificated
    ? <Route path={path} component={component} />
    : <Redirect to={{ pathname: '/login', state: { referrer: location.pathname }}}/>
)

const mapStateToProps = ( store ) => ({ isAuthentificated: store.session.username != null })
export default withRouter(connect(mapStateToProps)(EnhanchedRoute));
