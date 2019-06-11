import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Container, Dropdown, Icon, Message, Menu } from 'semantic-ui-react'
import { flashOperations, flashSelectors as Flash } from '../modules/flash'

class Header extends Component {

  state = { open: false }

  // path has changed --> disable flash message, unless redirected from /
  componentWillReceiveProps(nProps) {
    const { location, message, clearFlash } = this.props;
    if (message != null
        && location.pathname !== nProps.location.pathname
        && location.path !== '/')
      clearFlash();
  }

  toggleMenu = () => this.setState({ open: !this.state.open })


  item = (to, text, icon) => (
    <Menu.Item as={Link} active={location.pathname === to} to={to} icon={icon} name={text} />
  )

  render(){
    const { clearFlash, icon, location, message, messageType, username } = this.props

    return(
      <div>
        <Menu attached='top' inverted stackable>
          <Container>
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
          </Container>
        </Menu>
        {message &&
          <Message attached='bottom' onDismiss={clearFlash} {...messageType}>
            <Container fluid textAlign='center'>
              <Icon name={icon} />
              {message}
            </Container>
          </Message>
        }
      </div>
    )
  }
}

const mapStateToProps = store => ({
  icon: Flash.icon(store),
  message: Flash.message(store),
  messageType: Flash.messageType(store),
  username: store.session.username
});
const mapDispatchToProps = { clearFlash: flashOperations.clear }
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
