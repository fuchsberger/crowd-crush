import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Icon, Menu, Popup } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import { MarkerControls, MarkerInfo, PlayerControls, PlayInfo } from './'

const Item = connect(
  store => ({ currentMode: Sim.mode(store) }), { changeMode: simOperations.changeMode })(
    ({ animated, mode, title, icon, changeMode, currentMode }) =>
    <Popup inverted content={title} position="bottom center" trigger={
      <a onClick={() => changeMode(mode)}>
        <Icon
          color={currentMode == mode ? 'teal' : undefined}
          loading={animated && currentMode == mode}
          name={icon}
        />
      </a>
    } />
  )

const SimMenu = ({ mode }) => (
  <div style={{ width: '100%' }}>
    <Menu.Menu>
      <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />
        <Menu.Item as='div'>
          <Item mode='play' icon='play circle outline' title='Play Mode' animated />
          <Item mode='markers' icon='compass outline' title='Markers Mode' animated/>
          <Item mode='coords' icon='crosshairs' title='Coords Mode' animated/>
          <Item mode='mapStart' icon='street view' title='Heatmap: Starting Agents' />
        </Menu.Item>

        {mode == 'play' && <PlayerControls />}
        {mode == 'markers' && <MarkerControls />}
    </Menu.Menu>
    { mode == 'play' && <PlayInfo /> }
    { mode == 'markers' && <MarkerInfo /> }
  </div>
)

const mapStateToProps = store => ({ mode: Sim.mode(store) })
export default connect(mapStateToProps)(SimMenu)
