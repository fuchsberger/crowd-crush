import { connect } from 'react-redux'
import { Icon } from '../../components'
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Form } from 'reactstrap'
import { simOperations as Sim } from '../../modules/sim'

class ControlBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggleOverlayMenu = this.toggleOverlayMenu.bind(this);

    this.state = {
      overlayMenu: false,
      overlayModal: false
    };
  }

  toggleOverlayMenu() {
    this.setState({ overlayMenu: !this.state.overlayMenu });
  }

  render() {
    const {
      authenticated,
      overlay,
      overlays,
      play,
      pause,
      running,
      showModal,
      stop,
      update
    } = this.props;

    const { toggleOverlayMenu } = this

    const checkOverlay = ( value ) =>
      ( overlay === value ? <Icon fa check className="float-right" /> : null )

    const overlay_list =
      overlays.length === 0
        ? null
        : overlays.map((o, i) => (
            <DropdownItem key={i} onClick={() => setOverlay(o.youtubeID)}>
              <Icon fab youtube className="mr-2" />
              {o.title} {checkOverlay(o.youtubeID)}
            </DropdownItem>
          ));

    return (
      <Form inline>

        <Button className="mr-1" onClick={() => stop()}>
          <Icon fa stop />
        </Button>

        { running
          ? <Button className="mr-1" onClick={() => pause()}>
              <Icon fa pause />
            </Button>
          : <Button className="mr-1" onClick={() => play()}>
              <Icon fa play />
            </Button>
        }

        <ButtonDropdown
          className="mr-2 d-none d-sm-inline-block"
          isOpen={this.state.overlayMenu}
          toggle={toggleOverlayMenu}
        >
          <DropdownToggle caret>Overlay</DropdownToggle>
          <DropdownMenu>
            {authenticated && (
              <DropdownItem onClick={() => showModal('overlays')}>
                <Icon fa plus /> Manage Video Overlays
              </DropdownItem>
            )}
            {authenticated && <DropdownItem divider />}

            <DropdownItem onClick={() => update({ overlay: null })}>
              No Overlay
              {checkOverlay(null)}
            </DropdownItem>
            <DropdownItem onClick={() => update({ overlay: true })}>
              <Icon far circle /> White
              {checkOverlay(true)}
            </DropdownItem>
            <DropdownItem onClick={() => update({ overlay: false })}>
              <Icon fa circle /> Black
              {checkOverlay(false)}
            </DropdownItem>
            {overlays.length > 0 && <DropdownItem divider />}
            {overlay_list}
          </DropdownMenu>
        </ButtonDropdown>
      </Form>
    );
  }
}

const mapStateToProps = store => ({
  authenticated: !!store.session.user,
  overlay: store.sim.overlay,
  overlays: store.sim.overlays,
  running: store.sim.running
});

const mapDispatchToProps = {
  play: Sim.play,
  pause: Sim.pause,
  stop: Sim.stop,
  update: Sim.update
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
