import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const DefaultMenu = ({ user }) => (
  <div>
    <Menu.Item header exact as={NavLink} to='/' name='Crowd Crush' />
    <Menu.Item as={NavLink} to='/videos' icon='video camera' name='Videos' />
    {user && <Menu.Item as={NavLink} to='/video/add' icon='plus' name='Add Video' />}
    {user && <Menu.Item as={NavLink} to='/users' icon='users' name='Users' />}
  </div>
)

export default DefaultMenu
