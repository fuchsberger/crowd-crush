import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import { SimTime } from '../../pages/sim'

const SimMenu = ({ play, pause, playerState, stop }) => (
  <div>
    <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />
    {playerState == 1
      ? <Menu.Item icon='pause' onClick={() => pause()}/>
      : <Menu.Item icon='play' onClick={() => play()}/>
    }
    <Menu.Item icon='stop' onClick={() => stop()} />
    <Menu.Item>
      <Icon name='clock outline' />
      <SimTime />
    </Menu.Item>

    {/* {user && <Menu.Item as={NavLink} to='/video/add' icon='plus' name='Add Video' />}
    {user && <Menu.Item as={NavLink} to='/users' icon='users' name='Users' />} */}
  </div>
)

const mapStateToProps = store => ({
  playerState: Sim.playerState(store)
})

const mapDispatchToProps = {
  play: simOperations.play,
  pause: simOperations.pause,
  stop: simOperations.stop,
  // update: simOperations.update
}

export default connect(mapStateToProps, mapDispatchToProps)(SimMenu)
