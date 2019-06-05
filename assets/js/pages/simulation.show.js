import { connect } from 'react-redux'
import YouTube from 'react-youtube'
import { Container } from 'reactstrap'
import { YOUTUBE_PLAYER_OPTS } from '../config'
import { simOperations as Sim } from '../modules/sim'
import { ControlBar, Overlay } from './sim'
import ModalOverlays from './sim/modal_overlays'
import Loading from '../components/loading'
import Error from './error'

class SimShowView extends React.Component {
  constructor(props) {
    super(props);

    this.stateChange = this.stateChange.bind(this)
    this.updateState = this.updateState.bind(this)

    this.ready = false
    this.timer = null

    // initialize state
    this.state = {
      showOverlayMenu: false,
      showOverlayModal: false
    };
  }

  componentDidMount() {
    // join simulation if simulation was loaded through video list
    if(this.props.socketReady)
      this.props.joinSimulation(this.props.match.params.id, { overlays: true });
  }

  componentDidUpdate(pProps){
    // join simulation if simulation was directly loaded
    if( !pProps.socketReady && this.props.socketReady )
      this.props.joinSimulation(this.props.match.params.id, { overlays: true });
  }

  componentWillUnmount() {
    this.props.leaveSimulation();
  }

  stateChange(e){
    if(!this.ready && e.data == 1){
      this.props.player.pauseVideo()
      this.props.player.seekTo(0, true)
      this.ready = true;
    }
  }

  // updates a single state value from a lower component
  updateState(field, value = null) {
    if (value === null) return this.setState({ [field]: !this.state[field] });
    if (value !== this.state[field]) return this.setState({ [field]: value });
  }

  render() {
    const { error, loadPlayer, overlay, simLoaded, youtubeID } = this.props;

    if (error) return (<Error heading="Video not found." />);
    if (!simLoaded) return <Loading />;

    const { showOverlayMenu, showOverlayModal } = this.state
    const { stateChange, updateState } = this

    // const agent_count_total = agents ? Object.keys(agents).length : null;
    // const agent_count_visible = agents
    //   ? simSelectors.getVisibleAgents(agents, time)
    //   : null

    return (
      <Container>
        <div className="video-wrapper">
          <YouTube
            videoId={typeof overlay === 'string' ? overlay : youtubeID}
            opts={{ ...YOUTUBE_PLAYER_OPTS, height: "100%", width: "100%" }}
            onReady={(e) => loadPlayer(e.target)}
            onStateChange={stateChange}
            style={{position: 'absolute'}}
          />
          <Overlay modal={showOverlayModal} />
        </div>
        <ControlBar
          showOverlayMenu={showOverlayMenu}
          update={updateState}
        />
        {/* <ModalOverlays /> */}
      </Container>
    );
  }
}

const mapStateToProps = store => ({
  agent_hovered: store.sim.agent_hovered,
  agent_selected: store.sim.agentSelected,
  error: store.sim.error,
  overlay: store.sim.overlay,
  player: store.sim.player,
  simLoaded: store.sim.markers && store.sim.overlays,
  socketReady: !!store.session.socket,
  youtubeID: store.sim.video && store.sim.video.youtubeID
});

const mapDispatchToProps = {
  joinSimulation: Sim.join,
  leaveSimulation: Sim.leave,
  loadPlayer: Sim.loadPlayer
}

export default connect(mapStateToProps, mapDispatchToProps)(SimShowView);
