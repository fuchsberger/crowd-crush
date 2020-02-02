import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../../modules/session'
import { LoginItem } from './'

const DefaultMenu = ({ isAuthenticated }) =>
  <Menu fixed='top' inverted>
    <Menu.Menu>
      <Menu.Item header exact as={NavLink} to='/' name='Crowd Crush' />
      <Menu.Item as={NavLink} to='/videos' icon='video' name='Videos' />
      {isAuthenticated && <Menu.Item as={NavLink} to='/video/add' icon='add' name='Add Video' />}
      {isAuthenticated && <Menu.Item as={NavLink} to='/users' icon='user' name='Users' />}
    </Menu.Menu>,
    <Menu.Menu position='right'>
      <LoginItem />
    </Menu.Menu>
  </Menu>
const mapStateToProps = store => ({ isAuthenticated: Session.isAuthenticated(store) })
export default connect(mapStateToProps)(DefaultMenu)
