import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import { SimTime } from '../../pages/sim'
import { LoginItem, MarkerControls, PlayerControls } from './'

const SimMenu = ({ changeMode, mode }) => ([
  <Menu.Menu key={0}>
    <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />

    <Menu.Item>
      Mode:&nbsp;
      <a onClick={() => changeMode('play')} title='Play Mode'>
        <Icon
          color={mode == 'play' ? 'teal' : undefined}
          loading={mode == 'play'}
          name='play circle outline'
        />
      </a>
      <a onClick={() => changeMode('markers')} title='Markers Mode'>
        <Icon
          color={mode == 'markers' ? 'teal' : undefined}
          loading={mode == 'markers'}
          name='compass outline'
        />
      </a>
      <a onClick={() => changeMode('coords')} title='Coords Mode'>
        <Icon
          color={mode == 'coords' ? 'teal' : undefined}
          loading={mode == 'coords'}
          name='crosshairs'
        />
      </a>
    </Menu.Item>
    {mode == 'play' && <PlayerControls />}
    {mode == 'markers' && <MarkerControls />}
  </Menu.Menu>,
  <Menu.Menu key={1} position='right'>
    { mode != 'coords' &&
      <Menu.Item>
        <Icon name='clock outline' />
        <SimTime />
      </Menu.Item>
    }
    <LoginItem />
  </Menu.Menu>
])

const mapStateToProps = store => ({ mode: Sim.mode(store) })
const mapDispatchToProps = { changeMode: simOperations.changeMode }
export default connect(mapStateToProps, mapDispatchToProps)(SimMenu)
