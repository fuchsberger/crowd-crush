/**
 * Referrer
 * If URL contains ?redirect=/path will redirect to that path
 */
import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'

const Referrer = ({ location }) => {
  const params = new URLSearchParams(location.search)
  const redirect = params.get('redirect')
  if(redirect) return <Redirect to={redirect} />
  if(location.pathname == '/') return <Redirect to="/about" />
  return null
}

export default withRouter(Referrer)
