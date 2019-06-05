import { connect } from 'react-redux'
import { Icon } from '../../components'
import { Nav, NavItem, NavLink } from 'reactstrap'
import { simOperations as Sim } from '../../modules/sim'

const ControlsMode = ({ authenticated, mode, setMode }) => (
  <Nav navbar className='d-none d-md-flex'>
    <NavItem><span className="navbar-text">Mode:</span></NavItem>
    <NavItem active={mode === 'sim'}>
      <NavLink id="btnSimMode" onClick={() => setMode('sim')}>
        <Icon far play-circle spin={mode === 'sim'} />
      </NavLink>
    </NavItem>
    <NavItem active={mode === 'coords'}>
      <NavLink id="btnCoordsMode" onClick={() => setMode('coords')}>
        <Icon far compass spin={mode === 'coords'} />
      </NavLink>
    </NavItem>
    { authenticated &&  (
      <NavItem active={mode === 'markers'}>
        <NavLink id="btnMarkerMode" onClick={() => setMode('markers')}>
          <Icon fa crosshairs spin={mode === 'markers'} />
        </NavLink>
      </NavItem>
    )}
  </Nav>
);

const mapStateToProps = store => ({
  authenticated: !!store.session.user,
  mode: store.sim.mode
});

const mapDispatchToProps = { setMode: Sim.setMode }

export default connect(mapStateToProps, mapDispatchToProps)(ControlsMode);
