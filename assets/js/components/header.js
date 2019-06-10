import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Dropdown, Icon, Input, Form, Menu } from 'semantic-ui-react'
import { sessionOperations as Session } from '../modules/session'

class Header extends Component {

  state = { open: false }

  toggleMenu = () => this.setState({ open: !this.state.open })


  item = (to, text, icon) => (
    <Menu.Item as={Link} active={location.pathname === to} to={to} icon={icon} name={text} />
  )

  render(){
    const { location, username } = this.props
    return(
      <Menu attached='top' inverted stackable>
        <Menu.Item header>Crowd Crush</Menu.Item>
        <Menu.Item
          active={this.state.open}
          id="collapse-button"
          name='Menu'
          icon="bars"
          onClick={this.toggleMenu}
          position='right'
        />

        {this.item('/about', 'About', 'info')}
        {this.item('/videos', 'Videos', 'video camera')}
        {username && this.item('/video/add', 'Add Video', 'plus')}
        {username && this.item('/users', 'Users', 'users')}

        <Menu.Menu  position='right'>
          {!username && location.pathname != '/login' && this.item('/login', 'Login', 'power')}
          {username &&
            <Dropdown item icon='caret down' text={username}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to='/settings' icon='cog' content='Settings' />
                <Dropdown.Item as='a' href='/logout' icon='power' content='Sign Out' />
              </Dropdown.Menu>
            </Dropdown>
          }
        </Menu.Menu>
      </Menu>
    )
  }
}

const mapStateToProps = ({ session }) => ({ username: session.username });
export default withRouter(connect(mapStateToProps)(Header));
