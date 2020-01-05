import React, { Component } from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import Markers from './markers'
import { Heatmap } from '.'

class Overlay extends Component {

  render(){
    const { frameCSS, mode, moveCursor, overlay, setMarker } = this.props

    // prepare background and cursor class
    let bgClass = mode !== 'sim' ? ' edit' : ''
    if (overlay === false) bgClass += ' bg-dark'
    if (overlay === true) bgClass += ' bg-light'

    // decide what to display on the overlay
    let renderCoords = false, renderMap=false, renderMarkers=false
    switch(mode){
      case 'coords': renderCoords= true; break
      case 'mapStart': renderMap = true; break
      case 'markers': renderMarkers = true; break
      case 'play': renderMarkers = true; break
    }

    return (
      <div className='overlay'>
        <div
          id='overlay'
          className={"overlay" + bgClass}
          onClick={e => mode == 'markers' ? setMarker(e) : null}
          onMouseMove={e => mode != 'play' ? moveCursor(e) : null}
          onMouseLeave={e => mode != 'play' ? moveCursor(null) : null}
          style={frameCSS}
        >
          {/* { renderCoords && <Coordinates />} */}
          { renderMarkers && <Markers /> }
        </div>
        { renderMap && <Heatmap />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  frameCSS: Sim.frameCSS(state),
  mode: Sim.mode(state),
  overlay: Sim.overlay(state)
})

const mapDispatchToProps = {
  setMarker: simOperations.setMarker,
  moveCursor: simOperations.moveCursor
}
export default connect(mapStateToProps, mapDispatchToProps)(Overlay)
