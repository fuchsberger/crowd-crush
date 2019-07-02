import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Icon, Menu, Popup } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import { MarkerControls, MarkerInfo, PlayerControls, PlayInfo } from './'

const SimMenu = ({ changeMode, mode }) => (
  <div style={{ width: '100%' }}>
    <Menu.Menu>
      <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />
      <Popup
        inverted
        trigger={
          <Menu.Item as='div'>
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
        }
        content='Simulation Mode'
        position='bottom center'
      />
      {mode == 'play' && <PlayerControls />}
      {mode == 'markers' && <MarkerControls />}
    </Menu.Menu>
    { mode == 'play' && <PlayInfo /> }
    { mode == 'markers' && <MarkerInfo /> }
  </div>
)

const mapStateToProps = store => ({ mode: Sim.mode(store) })
const mapDispatchToProps = { changeMode: simOperations.changeMode }
export default connect(mapStateToProps, mapDispatchToProps)(SimMenu)
