import React from 'react'
import { Menu } from 'semantic-ui-react'
import { LoginItem, TimeItem } from './'

export default () => (
  <Menu.Menu position='right'>
    <TimeItem />
    <LoginItem />
  </Menu.Menu>
)
