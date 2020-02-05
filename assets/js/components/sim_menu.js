import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import { Login, MarkerControls, MarkerInfo, MapSpawnControls, PlayerControls, Position, Time } from './controls'

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

  render_marker_controls() {
    if (this.props.match.params.action == 'markers') return <MarkerControls />
  }

  render_marker_info() {
    if (this.props.match.params.action == 'markers') return <MarkerInfo />
  }

  render_map_spawn_controls() {
    if (this.props.match.params.action == 'map-spawn') return <MapSpawnControls />
  }

  render_player_controls(){
    switch(this.props.match.params.action){
      case 'watch':
      case 'run':
      case 'simulate':
        return <PlayerControls key={1} />
    }
  }

  render_position() {
    if (this.props.match.params.action == 'markers') return <Position />
  }

  render_time() {
    switch(this.props.match.params.action){
      case 'watch':
      case 'run':
      case 'simulate':
      case 'markers':
        return <Time />
    }
  }

  render() {
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

        {this.render_player_controls()}
        {this.render_marker_controls()}
        {this.render_map_spawn_controls()}

        <Menu.Menu position='right'>
          {this.render_marker_info()}
          {this.render_position()}
          {this.render_time()}
          <Login />
        </Menu.Menu>

        {/* { match.params.action == 'watch' && }
        { match.params.action == 'markers' && <MarkerControls />}
        { match.params.action == 'mapStart' && <HeatMapControls />}
        { match.params.action == 'play' && <PlayInfo /> } */}
      </Menu>
    )
  }
}
export default SimMenu
