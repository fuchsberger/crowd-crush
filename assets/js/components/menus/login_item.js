import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../../modules/session'

class Header extends Component {

  state = { open: false }

  toggle = () => this.setState({ open: !this.state.open })

  render(){
    const { isAuthenticated, username } = this.props

    return !isAuthenticated
      ? <Menu.Item as={NavLink} to='/login' icon='power' name='Login' />
      : <Dropdown item icon='caret down' text={username}>
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to='/settings' icon='cog' content='Settings' />
            <Dropdown.Item as='a' href='/logout' icon='power' content='Sign Out' />
          </Dropdown.Menu>
        </Dropdown>
  }
}

const mapStateToProps = store => ({
  isAuthenticated: Session.isAuthenticated(store),
  username: Session.username(store)
})
export default connect(mapStateToProps)(Header)
