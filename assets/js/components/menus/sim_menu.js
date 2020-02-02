import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Dropdown, Icon, Menu, Popup } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import { MarkerControls, HeatMapControls, MarkerInfo, PlayerControls, PlayInfo } from './'

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

const title = mode => {
  switch (mode) {
    case 'play': return "Play Video"
    case 'playMarkers': return "Play Annotation"
    // case 'playMarkers': return "Play Annotation"
    case 'markers': return "Annotate Agents"
    case 'coords': return "Simulation Params"
    case 'mapStart': return "Spawning Areas"
    case 'mapExit': return "Exit Areas"
    default: console.log(mode + 'not available.')
  }
}

const SimMenu = ({ setMode, mode }) =>
  <Menu fixed='top' inverted>
    <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />

    {/* <Dropdown item compact inline selection={mode} options={action_options} /> */}

    <Dropdown item text={title(mode)}>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setMode("play")}>Play Video</Dropdown.Item>
        <Dropdown.Item onClick={() => setMode("play-markers")}>Play Annotation</Dropdown.Item>
        <Dropdown.Item onClick={() => setMode("play-sim")}>Play Simulation</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => setMode("coords")}>Setup Simulation</Dropdown.Item>
        <Dropdown.Item onClick={() => setMode("markers")}>Annotate</Dropdown.Item>
        <Dropdown.Item onClick={() => setMode("mapStart")}>Spawning Areas</Dropdown.Item>
        <Dropdown.Item onClick={() => setMode("mapExit")}>Exit Areas</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

    { mode == 'play' && <PlayerControls />}
    { mode == 'markers' && <MarkerControls />}
    { mode == 'mapStart' && <HeatMapControls />}
    { mode == 'play' && <PlayInfo /> }
    { mode == 'markers' && <MarkerInfo /> }
  </Menu>

const mapStateToProps = store => ({ mode: Sim.mode(store) })
const mapDispatchToProps = { setMode: simOperations.setMode }
export default connect(mapStateToProps, mapDispatchToProps)(SimMenu)
