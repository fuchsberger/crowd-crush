import React from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
// import Coordinates from './coordinates'
import Markers from './markers'

const Overlay = ({ frameCSS, mode, moveCursor, overlay, setMarker }) => {

  // prepare background and cursor class
  let bgClass = mode !== 'sim' ? ' edit' : ''
  if (overlay === false) bgClass += ' bg-dark'
  if (overlay === true) bgClass += ' bg-light'

  return (
    <div className='video-wrapper'>
      <div
        className={"overlay" + bgClass}
        onClick={e => mode == 'markers' ? setMarker(e) : null}
        onMouseMove={e => mode != 'play' ? moveCursor(e) : null}
        onMouseLeave={e => mode != 'play' ? moveCursor(null) : null}
        style={frameCSS}
      >
        {/* { mode == 'coords' ? <Coordinates /> : <Markers /> } */}
        { mode == 'coords' ? null : <Markers /> }
      </div>
    </div>
  )
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
