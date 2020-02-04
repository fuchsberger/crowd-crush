import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import { MarkerControls, HeatMapControls, MarkerInfo, PlayerControls, PlayInfo } from './'

class SimMenu extends Component {

  scene_link(title, action){
    return(
      <Dropdown.Item as={NavLink} to={`/scene/${this.props.match.params.id}/${action}`}>
        {title}
      </Dropdown.Item>
    )
  }

  title(){
    switch (this.props.match.params.action) {
      case 'watch': return "Play Video"
      case 'run': return "Play Annotation"
      case 'simulate': return "Play Simulation"
      case 'markers': return "Annotate / Markers"
      case 'coords': return "Simulation Configuration"
      case 'map-spawn': return "Spawning Areas"
      case 'map-exit': return "Exit Areas"
      default: return "Unknown Mode"
    }
  }

  render_modules(){
    switch(this.props.match.params.action){
      case 'watch':
        <PlayerControls />
    }
  }

  render(){
    return(
      <Menu fixed='top' inverted>
        <Menu.Item header exact as={NavLink} to='/videos' name='Exit Simulation' />

        <Dropdown item text={this.title()}>
          <Dropdown.Menu>
            { this.scene_link("Play Video", "watch") }
            { this.scene_link("Play Annotation", "run") }
            { this.scene_link("Play Simulation", "simulate") }
            <Dropdown.Divider />
            { this.scene_link("Scene Settings", "coords") }
            { this.scene_link("Annotate / Markers", "markers") }
            { this.scene_link("Spawning Areas", "map-spawn") }
            { this.scene_link("Exit Areas", "map-exit") }
          </Dropdown.Menu>
        </Dropdown>

        { this.render_modules() }

        {/* { match.params.action == 'watch' && }
        { match.params.action == 'markers' && <MarkerControls />}
        { match.params.action == 'mapStart' && <HeatMapControls />}
        { match.params.action == 'play' && <PlayInfo /> }
        { match.params.action == 'markers' && <MarkerInfo /> } */}
      </Menu>
    )
  }
}
export default SimMenu
