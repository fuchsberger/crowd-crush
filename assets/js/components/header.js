import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container, Dropdown, Icon, Message, Menu } from 'semantic-ui-react'
import { flashOperations, flashSelectors as Flash } from '../modules/flash'
import { DefaultMenu } from './menus'

class Header extends Component {

  state = { open: false }

  toggle = () => this.setState({ open: !this.state.open })

  render(){
    const { clearFlash, icon, message, messageType, user } = this.props
    return([
      <Menu attached='bottom' inverted stackable key={0}>
        <Container>
          <Menu.Item
            active={this.state.open}
            id="collapse-button"
            name='Menu'
            icon="bars"
            onClick={() => this.toggle()}
            position='right'
          />
          <DefaultMenu user={user} />
          <Menu.Menu position='right'>
            {!user && <Menu.Item as={NavLink} to='/login' icon='power' name='Login' />}
            {user &&
              <Dropdown item icon='caret down' text={user}>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to='/settings' icon='cog' content='Settings' />
                  <Dropdown.Item as='a' href='/logout' icon='power' content='Sign Out' />
                </Dropdown.Menu>
              </Dropdown>
            }
          </Menu.Menu>
        </Container>
      </Menu>,
      <Message  id='flash' attached='bottom' key={1} onDismiss={clearFlash} hidden={!message} {...messageType}>
        <Container fluid textAlign='center'>
          <Icon name={icon} />
          {message}
        </Container>
      </Message>
    ])
  }
}

const mapStateToProps = store => ({
  icon: Flash.icon(store),
  message: Flash.message(store),
  messageType: Flash.messageType(store),
  user: store.user
});
const mapDispatchToProps = { clearFlash: flashOperations.clear }
export default connect(mapStateToProps, mapDispatchToProps)(Header);
