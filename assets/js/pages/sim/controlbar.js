import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { ControlsCoords, ControlsMode, ControlsMarkers, ControlsPlayer, ControlsTime } from '.'

const ControlBar = ({ mode }) => (
  <Menu className="justify-content-between" color="dark" dark
    fixed="bottom" expand="md">
    <ControlsMode />
    { mode == 'sim'     && <ControlsPlayer /> }
    { mode == 'markers' && <ControlsMarkers /> }
    { mode == 'coords'
        ? <ControlsCoords />
        : <ControlsTime inPercent={ mode == 'sim' } />
    }
  </Menu>
);

const mapStateToProps = store => ({ mode: store.sim.mode });
export default connect( mapStateToProps )(ControlBar);
