import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../../modules/session'
import { LoginItem } from './'

const DefaultMenu = ({ isAuthenticated }) => ([
  <Menu.Menu key={0}>
    <Menu.Item header exact as={NavLink} to='/' name='Crowd Crush' />
    <Menu.Item as={NavLink} to='/videos' icon='video camera' name='Videos' />
    {isAuthenticated && <Menu.Item as={NavLink} to='/video/add' icon='plus' name='Add Video' />}
    {isAuthenticated && <Menu.Item as={NavLink} to='/users' icon='users' name='Users' />}
  </Menu.Menu>,
  <Menu.Menu key={1} position='right'>
    <LoginItem />
  </Menu.Menu>
])
const mapStateToProps = store => ({ isAuthenticated: Session.isAuthenticated(store) })
export default connect(mapStateToProps)(DefaultMenu)
