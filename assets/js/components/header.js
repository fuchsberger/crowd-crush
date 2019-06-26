import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Icon, Message, Menu } from 'semantic-ui-react'
import { flashOperations, flashSelectors as Flash } from '../modules/flash'
import { simSelectors as Sim } from '../modules/sim'
import { DefaultMenu, SimMenu } from './menus'

class Header extends Component {

  state = { open: false }

  toggle = () => this.setState({ open: !this.state.open })

  render(){
    const { clearFlash, icon, message, messageType, simulation } = this.props
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
          {simulation ? <SimMenu /> : <DefaultMenu />}
        </Container>
      </Menu>,
      <Message id='flash' attached='bottom' key={1} onDismiss={clearFlash} hidden={!message} {...messageType}>
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
  simulation: Sim.playerReady(store)
})
const mapDispatchToProps = { clearFlash: flashOperations.clear }
export default connect(mapStateToProps, mapDispatchToProps)(Header)
