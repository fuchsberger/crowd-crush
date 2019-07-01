import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Input, Menu } from 'semantic-ui-react'
import { keyOperations, keySelectors as Keys } from '../../modules/keys'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

class MarkerControls extends Component {

  render(){
    const { changeJumpInterval, jump, jumpTime } = this.props
    return(
      <Menu.Menu>
        <Menu.Item icon='step backward' onClick={() => jump('backward')}/>
        <Menu.Item icon='step forward' onClick={() => jump('forward')}/>
        <Menu.Item title='Jump Interval'>
          <Icon name='stopwatch' />
          <Input
            id='inputJumpInterval'
            inverted
            onChange={e => changeJumpInterval(parseInt(e.target.value, 10))}
            value={jumpTime}
          />
        </Menu.Item>
      </Menu.Menu>
    )
  }
}

const mapStateToProps = store => ({
  agentSelected: Sim.agentSelected(store),
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
