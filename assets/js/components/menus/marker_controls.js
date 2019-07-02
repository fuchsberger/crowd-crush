import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Input, Menu, Popup } from 'semantic-ui-react'
import { keyOperations, keySelectors as Keys } from '../../modules/keys'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

class MarkerControls extends Component {

  render(){
    const { backwardPossible, changeJumpInterval, forwardPossible, jump, jumpTime } = this.props
    return(
      <Menu.Menu>
        <Popup
          inverted
          trigger={
            <Menu.Item
              disabled={!backwardPossible}
              icon='step backward'
              onClick={() => jump('backward')}
            />
          }
          content='jump backwards (interval)'
          position='bottom center'
        />
        <Popup
          inverted
          trigger={
            <Menu.Item
              disabled={!forwardPossible}
              icon='step forward'
              onClick={() => jump('forward')}
            />
          }
          content='jump forwards (interval)'
          position='bottom center'
        />
        <Popup
          inverted
          trigger={
            <Menu.Item title='Jump Interval'>
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
      </Menu.Menu>
    )
  }
}

const mapStateToProps = store => ({
  agentSelected: Sim.agentSelected(store),
  backwardPossible: Sim.backwardPossible(store),
  forwardPossible: Sim.forwardPossible(store),
  jumpTime: Sim.jumpTime(store),
  keys: Keys.pressed(store)
})

const mapDispatchToProps = {
  changeJumpInterval: simOperations.changeJumpInterval,
  keyDown: keyOperations.down,
  keyUp: keyOperations.up,
  jump: simOperations.jump,
  removeAgent: simOperations.removeAgent,
  removeAllAgents: simOperations.removeAllAgents,
  selectAgent: simOperations.selectAgent
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerControls)
