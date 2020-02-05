import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Input, Menu, Popup } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../../modules/session'
import { playerOperations, playerSelectors as Player } from '../../modules/player'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

class MarkerControls extends Component {

  state = { jumpTime : this.props.jumpTime }

  constructor(props){
    super(props)
    this.keyUp = this.keyUp.bind(this)
  }

  componentDidMount(){
    document.addEventListener('keyup', this.keyUp)
  }

  componentWillUnmount(){
    document.removeEventListener('keyup', this.keyUp)
  }

  changeJumpTime(e) {
    if (parseFloat(e.target.value)) this.props.changeJumpInterval(parseFloat(e.target.value))
    this.setState({ jumpTime: e.target.value })
  }

  keyUp(e){
    const { isAuthenticated, jump, selectAgent, setMarker } = this.props

    switch(e.keyCode){
      case 32: // SPACE
        return isAuthenticated && setMarker()
      case 69: // E
        return jump('forward')
      case 81: // Q
        return jump('backward')
      case 83: // S
        return selectAgent()
    }
  }

  render(){
    const {
      agentCount,
      agentSelected,
      backwardPossible,
      deleteMarkers,
      forwardPossible,
      isAuthenticated,
      jump,
      jumpTime
    } = this.props

    return(
      <Menu.Menu>
        <Popup
          inverted
          trigger={
            <Menu.Item
              color={backwardPossible ? null : 'grey'}
              disabled={!backwardPossible}
              icon='backward'
              onClick={() => jump('backward')}
            />
          }
          content='Jump Backward (Hotkey: Q)'
          position='bottom center'
        />
        <Popup
          inverted
          trigger={
            <Menu.Item
              color={forwardPossible ? null : 'grey'}
              disabled={!forwardPossible}
              icon='forward'
              onClick={() => jump('forward')}
            />
          }
          content='Jump Forward (Hotkey: E)'
          position='bottom center'
        />
        <Popup
          inverted
          trigger={
            <Menu.Item>
              <Icon name='clock' />
              <Input
                id='inputJumpInterval'
                inverted
                onChange={e => this.changeJumpTime(e)}
                value={this.state.jumpTime}
              />
            </Menu.Item>
          }
          content='Jump Inteval'
          position='bottom center'
        />
        { isAuthenticated && agentCount > 0 &&
          <Popup
            inverted
            trigger={
              <Menu.Item onClick={() => deleteMarkers()}>
                <Icon color='red' name='cancel' />
              </Menu.Item>
            }
            content={agentSelected ? "Delete Current Agent" : "Delete all Agents"}
            position='bottom center'
          />
        }
      </Menu.Menu>
    )
  }
}

const mapStateToProps = store => ({
  isAuthenticated: Session.isAuthenticated(store),
  agentCount: Sim.agentCount(store),
  agentSelected: Sim.agentSelected(store),
  backwardPossible: Player.backwardPossible(store),
  channel: Sim.channel(store),
  forwardPossible: Player.forwardPossible(store),
  jumpTime: Player.jumpTime(store)
})

const mapDispatchToProps = {
  changeJumpInterval: playerOperations.changeJumpInterval,
  deleteMarkers: simOperations.deleteMarkers,
  jump: playerOperations.jump,
  selectAgent: simOperations.selectAgent,
  setMarker: simOperations.setMarker
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerControls)
