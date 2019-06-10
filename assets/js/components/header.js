import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Dropdown, Icon, Form, Menu } from 'semantic-ui-react'
import { sessionOperations as Session } from '../modules/session'

class Header extends Component {

  state = { open: false }

  toggleMenu = () => this.setState({ open: !this.state.open })


  item = (to, text, icon) => (
    <Menu.Item as={Link} active={location.pathname === to} to={to} icon={icon} name={text} />
  )

  render(){
    const { location, history, signOut, username } = this.props
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

          {/* <Menu.Item>
            <Input icon='search' disabled placeholder='Search...' />
          </Menu.Item> */}
          {!username && location.pathname != '/login' && this.item('/login', 'Login', 'power')}

          {username &&
            <Dropdown item icon='caret down' text={username}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/settings">
                  <Icon name='cog' />
                  Settings
                </Dropdown.Item>
                <Form
                  acceptCharset="UTF-8"
                  action="/logout"
                  method="post"
                >
                  <Form.Input type='hidden' name='_utf8' value="✓" />
                  <Form.Input type='hidden' name='_csrf_token' value={window.csrfToken}/>
                  <Dropdown.Item as={Form.Button}>
                    <Icon name='power' />
                    Sign Out
                  </Dropdown.Item>
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          }
        </Menu.Menu>
      </Menu>
    )
  }
}

const mapStateToProps = ({ session }) => ({ username: session.username });
const mapDispatchToProps = { signOut: Session.signOut }
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
