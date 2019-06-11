/**
 * Protected Route
 * Wraps a Route and redirects to login, if user is not authentificated
 */
import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({ component, isAuthentificated, path }) => (
  isAuthentificated
    ? <Route path={path} component={component} />
    : <Redirect to={{ pathname: '/login', state: { referrer: path }}}/>
)

const mapStateToProps = ( store ) => ({ isAuthentificated: store.session.username != null })
export default connect(mapStateToProps)(ProtectedRoute);
