import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

const SimMenu = ({ play, pause, state, stop, user }) => (
  <div>
    <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />
    {state == 1
      ? <Menu.Item icon='pause' onClick={() => pause()}/>
      : <Menu.Item icon='play' onClick={() => play()}/>
    }
    <Menu.Item icon='stop' onClick={() => stop()} />

    {/* {user && <Menu.Item as={NavLink} to='/video/add' icon='plus' name='Add Video' />}
    {user && <Menu.Item as={NavLink} to='/users' icon='users' name='Users' />} */}
  </div>
)

const mapStateToProps = store => ({ state: Sim.state(store) })

const mapDispatchToProps = {
  play: simOperations.play,
  pause: simOperations.pause,
  stop: simOperations.stop,
  // update: simOperations.update
}

export default connect(mapStateToProps, mapDispatchToProps)(SimMenu)
