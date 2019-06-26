import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import { SimTime } from '../../pages/sim'

const SimMenu = ({ changeMode, mode, play, pause, playerState, stop }) => ([
  <Menu.Menu key={0}>
    <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />

    <Menu.Item>
      Mode:&nbsp;
      <Icon
        color={mode == 'play' ? 'teal' : undefined}
        loading={mode == 'play'}
        name='play circle outline'
        onClick={() => changeMode('play')}
        title='Play Mode'
      />
      <Icon
        color={mode == 'markers' ? 'teal' : undefined}
        loading={mode == 'markers'}
        name='compass outline'
        onClick={() => changeMode('markers')}
        title='Markers Mode'
      />
      <Icon
        color={mode == 'coords' ? 'teal' : undefined}
        loading={mode == 'coords'}
        name='crosshairs'
        onClick={() => changeMode('coords')}
        title='Coords Mode'
      />
    </Menu.Item>

    {playerState == 1
      ? <Menu.Item icon='pause' onClick={() => pause()}/>
      : <Menu.Item icon='play' onClick={() => play()}/>
    }
    <Menu.Item icon='stop' onClick={() => stop()} />

    {/* {user && <Menu.Item as={NavLink} to='/video/add' icon='plus' name='Add Video' />}
    {user && <Menu.Item as={NavLink} to='/users' icon='users' name='Users' />} */}
  </Menu.Menu>,
  <Menu.Menu key={1} position='right'>
    <Menu.Item>
      <Icon name='clock outline' />
      <SimTime />
    </Menu.Item>
  </Menu.Menu>
])

const mapStateToProps = store => ({
  mode: Sim.mode(store),
  playerState: Sim.playerState(store)
})

const mapDispatchToProps = {
  changeMode: simOperations.changeMode,
  play: simOperations.play,
  pause: simOperations.pause,
  stop: simOperations.stop
}

export default connect(mapStateToProps, mapDispatchToProps)(SimMenu)
