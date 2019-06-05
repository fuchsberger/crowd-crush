import { connect } from 'react-redux'
import { Navbar } from 'reactstrap'
import { ControlsCoords, ControlsMode, ControlsMarkers, ControlsPlayer, ControlsTime } from '.'

const ControlBar = ({ mode }) => (
  <Navbar className="justify-content-between" color="dark" dark
    fixed="bottom" expand="md">
    <ControlsMode />
    { mode == 'sim'     && <ControlsPlayer /> }
    { mode == 'markers' && <ControlsMarkers /> }
    { mode == 'coords'
        ? <ControlsCoords />
        : <ControlsTime inPercent={ mode == 'sim' } />
    }
  </Navbar>
);

const mapStateToProps = store => ({ mode: store.sim.mode });
export default connect( mapStateToProps )(ControlBar);
