import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container, Dropdown, Icon, Message, Menu } from 'semantic-ui-react'
import { flashOperations, flashSelectors as Flash } from '../modules/flash'

class Header extends Component {

  state = { open: false }

  toggleMenu = () => this.setState({ open: !this.state.open })

  render(){
    const { clearFlash, icon, message, messageType, username } = this.props
    return(
      <div>
        <Menu attached='top' inverted stackable>
          <Container>
            <Menu.Item
              active={this.state.open}
              id="collapse-button"
              name='Menu'
              icon="bars"
              onClick={this.toggleMenu}
              position='right'
            />
            <Menu.Item header exact as={NavLink} to='/' icon='info' name='Crowd Crush' />
            <Menu.Item as={NavLink} to='/videos' icon='video camera' name='Videos' />
            {username && <Menu.Item as={NavLink} to='/video/add' icon='plus' name='Add Video' />}
            {username && <Menu.Item as={NavLink} to='/users' icon='users' name='Users' />}

            <Menu.Menu  position='right'>
              {!username && <Menu.Item as={NavLink} to='/login' icon='power' name='Login' />}
              {username &&
                <Dropdown item icon='caret down' text={username}>
                  <Dropdown.Menu>
                    <Dropdown.Item as={NavLink} to='/settings' icon='cog' content='Settings' />
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
export default connect(mapStateToProps, mapDispatchToProps)(Header);
