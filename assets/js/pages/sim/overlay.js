import React from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
// import Coordinates from './coordinates'
import Markers from './markers'

const Overlay = ({ frameCSS, jump, mode, overlay, setMarker }) => {

  // prepare background and cursor class
  let bgClass = mode !== 'sim' ? ' edit' : '';
  if (overlay === false) bgClass += ' bg-dark';
  if (overlay === true) bgClass += ' bg-light';

  function onClick(e) {

    e.stopPropagation()

    if (mode == 'markers'){
      const rect = e.target.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMarker(x, y)
    }
  }

  return (
    <div className='video-wrapper'>
      <div
        className={"overlay" + bgClass}
        // onClick={onClick}
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
  overlay: state.sim.overlay
})

const mapDispatchToProps = {
  // jump: Sim.jump,
  // moveCursor: Sim.moveCursor,
  // setMarker: Sim.setMarker
}
export default connect(mapStateToProps, mapDispatchToProps)(Overlay)
