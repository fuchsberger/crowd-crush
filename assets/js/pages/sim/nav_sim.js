import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon } from '../../components'
import { Badge, Collapse, Navbar, NavbarToggler, Nav, NavbarBrand, NavItem,
  NavLink, UncontrolledTooltip } from 'reactstrap'
import { simOperations as Sim, simSelectors } from '../../modules/sim'

class NavSim extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = { collapsed: true };
  }

  toggleNavbar() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const {
      agent_count_total,
      agent_count_visible,
      authenticated,
      locked,
      mode,
      marker_count,
      x,
      y,
      abs_x,
      abs_y,
      showModal,
      updateSimulation
    } = this.props;

    const { collapsed } = this.state;
    const { toggleNavbar } = this;

    return (
      <Navbar color="dark" dark fixed="top" expand="md">
        <NavbarBrand tag={Link} to="/" className="mr-auto">
          Crowd Crush
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />

        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar className="ml-2 mr-auto">
            <NavItem>
              <NavLink tag={Link} to="/videos">
                <Icon fa film className="mr-1"/> Video List
              </NavLink>
            </NavItem>

            {agent_count_total !== null &&
              <span className="navbar-text">
                <Icon fa user className="ml-2 mr-1" />
                <Badge color="dark">
                  {agent_count_visible !== null && `${agent_count_visible} / `}
                  {agent_count_total}
                </Badge>
              </span>
            }
            {marker_count !== null &&
              <span className="navbar-text">
                <Icon far dot-circle className="ml-2 mr-1" />
                <Badge color="dark">{marker_count}</Badge>
              </span>
            }
            {x !== null && y != null && (
              <span className="navbar-text">
                <Icon fa location-arrow className="ml-2 mr-1" />
                { Math.floor(x * 100) + ',' + Math.floor(y * 100) }
                {abs_x !== null && !isNaN(abs_x) && abs_y !== null && !isNaN(abs_y) &&
                  ` | ${Math.round(abs_x * 100)/100},${Math.round(abs_y * 100)/100}m`}
              </span>
            )}
          </Nav>

          <Nav navbar>
            <span className="navbar-text">Mode:</span>
            <NavItem active={mode === 'sim'}>
              <NavLink id="btnSimMode" onClick={() =>
                updateSimulation({mode: 'sim'})}>
                <Icon far play-circle spin={mode === 'sim'} />
              </NavLink>
              <UncontrolledTooltip placement="bottom" target="btnSimMode">
                Simulation
              </UncontrolledTooltip>
            </NavItem>
            <NavItem active={mode === 'coords'}>
              <NavLink id="btnCoordsMode" onClick={() =>
                updateSimulation({mode: 'coords'})}>
                <Icon far compass spin={mode === 'coords'} />
              </NavLink>
              <UncontrolledTooltip placement="bottom" target="btnCoordsMode">
                Coordinates
              </UncontrolledTooltip>
            </NavItem>
            {!locked && authenticated &&  (
              <NavItem active={mode === 'markers'}>
                <NavLink id="btnMarkerMode" onClick={() =>
                  updateSimulation({mode: 'markers'})}>
                  <Icon fa crosshairs spin={mode === 'markers'} />
                </NavLink>
                <UncontrolledTooltip placement="bottom" target="btnMarkerMode">
                  Marker
                </UncontrolledTooltip>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = store => ({
  abs_x: store.ui.abs_X,
  abs_y: store.ui.abs_Y,
  authenticated: !!store.session.user,
  marker_count: simSelectors.markerCount(store),
  mode: store.simulation.mode,
  x: store.ui.mouse_X,
  y: store.ui.mouse_Y
});

const mapDispatchToProps = {
  updateSimulation: Sim.updateSimulation
}

export default connect(mapStateToProps, mapDispatchToProps)(NavSim);
