import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader } from 'semantic-ui-react'
import { sceneOperations, sceneSelectors as Scene } from '../modules/scene'
import { simOperations } from '../modules/sim'
import { Markers, Player, Robots, HeatmapSpawn, HeatmapExit } from './sim'

class ScenePage extends Component {
  componentDidMount() {
    this.props.joinSimulation(this.props.match.params.id)
  }

  componentWillUnmount() {
    this.props.leaveSimulation()
  }

  render_player() {
    // switch (this.props.match.params.action) {
    //   case 'watch':
    //   case 'run':
    //   case 'markers':
    //   case 'simulate':
    //     return <Player />
    // }
    return <Player />
  }

  render_markers() {
    const { dimensions, match } = this.props

    if (match.params.action != 'run' && match.params.action != 'markers') return

    const edit = match.params.action == 'markers'

    let bgClass = edit ? ' edit' : ''
    // if (overlay === false) bgClass += ' bg-dark'
    // if (overlay === true) bgClass += ' bg-light'

    return (
      <div
        id='overlay'
        className={"overlay" + bgClass}
        onClick={e => edit ? this.props.set_marker(e) : null}
        onMouseMove={e => this.props.move_cursor(e)}
        onMouseLeave={() => this.props.move_cursor(null)}
        style={{height: `${dimensions[1]}px`, width: `${dimensions[0]}px`}}
      >
        <Markers edit={edit}/>
      </div>
    )
  }

  render_simulation() {
    const { dimensions, match } = this.props

    if (match.params.action != 'simulate') return

    return (
      <div
        id='overlay'
        className="overlay"
        style={{height: `${dimensions[1]}px`, width: `${dimensions[0]}px`}}
      >
        <Robots simulation/>
      </div>
    )
  }


  render_map_spawn() {
    const { dimensions, match } = this.props

    if (match.params.action != 'map-spawn') return

    return (
      <div
        id='overlay'
        className="overlay"
        style={{height: `${dimensions[1]}px`, width: `${dimensions[0]}px`}}
      >
        <HeatmapSpawn />
        <Robots/>
      </div>
    )
  }

  render() {
    if (!this.props.id) return <Dimmer active><Loader inverted /></Dimmer>

    return (
      <div className='video-wrapper'>
        {this.render_player()}
        {this.render_markers()}
        {this.render_simulation()}
        {this.render_map_spawn()}
      </div>
    )
  }
}

const mapStateToProps = store => ({
  dimensions: Scene.dimensions(store),
  id: Scene.id(store)
})

const mapDispatchToProps = {
  joinSimulation: simOperations.join,
  leaveSimulation: simOperations.leave,
  load_scene: sceneOperations.load,
  move_cursor: simOperations.moveCursor,
  set_marker: simOperations.setMarker
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenePage)
