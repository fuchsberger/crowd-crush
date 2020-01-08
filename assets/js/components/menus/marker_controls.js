import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Input, Menu, Popup } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../../modules/session'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

class MarkerControls extends Component {

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
      channel,
      changeJumpInterval,
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
              icon='step backward'
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
              icon='step forward'
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
              <Icon name='stopwatch' />
              <Input
                id='inputJumpInterval'
                inverted
                onChange={e => changeJumpInterval(parseInt(e.target.value, 10))}
                value={jumpTime}
              />
            </Menu.Item>
          }
          content='Jump Inteval'
          position='bottom center'
        />
        { isAuthenticated &&
          <Popup
            inverted
            trigger={
              <Menu.Item
                disabled={agentCount == 0}
                onClick={() => deleteMarkers(channel)}
              >
                <Icon.Group>
                <Icon
                  color={agentCount == 0 ? 'grey' : null}
                  name={agentSelected ? "user" : "users"} />
                  <Icon corner color='red' name='dont' />
                </Icon.Group>
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
  backwardPossible: Sim.backwardPossible(store),
  channel: Sim.channel(store),
  forwardPossible: Sim.forwardPossible(store),
  jumpTime: Sim.jumpTime(store)
})

const mapDispatchToProps = {
  changeJumpInterval: simOperations.changeJumpInterval,
  deleteMarkers: simOperations.deleteMarkers,
  jump: simOperations.jump,
  selectAgent: simOperations.selectAgent,
  setMarker: simOperations.setMarker
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerControls)
