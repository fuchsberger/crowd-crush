import React, { Component } from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import Markers from './markers'
import { HeatmapSpawn, HeatmapExit } from '.'

class Overlay extends Component {

  render(){
    const { mode, moveCursor, height, width, overlay, render_map, render_markers, setMarker } = this.props

    // prepare background and cursor class
    let bgClass = mode !== 'sim' ? ' edit' : ''
    if (overlay === false) bgClass += ' bg-dark'
    if (overlay === true) bgClass += ' bg-light'

    return <div
      id='overlay'
      className={"overlay" + bgClass}
      onClick={e => mode == 'markers' ? setMarker(e) : null}
      onMouseMove={e => mode != 'play' ? moveCursor(e) : null}
      onMouseLeave={e => mode != 'play' ? moveCursor(null) : null}
      style={{height: `${height}px`, width: `${width}px`}}
    >
      { mode == "mapStart" && <HeatmapSpawn />}
      { mode == "mapExit" && <HeatmapExit />}
      { render_markers && <Markers /> }
    </div>
  }
}

const mapStateToProps = state => ({
  mode: Sim.mode(state),
  overlay: Sim.overlay(state),
  height: Sim.video_height(state),
  width: Sim.video_width(state),
  // render_coords: Sim.renderCoords(state),
  mode: Sim.mode(state),
  render_markers: Sim.render_markers(state),
})

const mapDispatchToProps = {
  setMarker: simOperations.setMarker,
  moveCursor: simOperations.moveCursor
}
export default connect(mapStateToProps, mapDispatchToProps)(Overlay)
