import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Dimmer, Loader } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../modules/sim'
import { Overlay, Player } from './sim'

class Simulation extends Component {

  // showOverlayMenu: false,
  // showOverlayModal: false,

  componentDidMount() {
    // load async data
    this.props.joinSimulation(parseInt(this.props.match.params.id), this.props.history.push)
  }

  componentWillUnmount() {
    this.props.leaveSimulation(this.props.history.push)
  }

  // // updates a single state value from a lower component
  // updateState(field, value = null) {
  //   if (value === null) return this.setState({ [field]: !this.state[field] });
  //   if (value !== this.state[field]) return this.setState({ [field]: value });
  // }

  render() {

    const { playerReady } = this.props

    // const { showOverlayMenu, showOverlayModal } = this.state
    // const { updateState } = this

    // // const agent_count_total = agents ? Object.keys(agents).length : null;
    // // const agent_count_visible = agents
    // //   ? simSelectors.getVisibleAgents(agents, time)
    // //   : null

    return (
      <Container className='video-wrapper' fluid>
        <Player/>
        <Overlay />
        {/* modal={showOverlayModal} /> */}

        {/* <ControlBar
          showOverlayMenu={showOverlayMenu}
          update={updateState}
        /> */}
        {/* <ModalOverlays /> */}
        {!playerReady && <Dimmer active><Loader inverted/></Dimmer>}
      </Container>
    )
  }
}

const mapStateToProps = store => ({
  // agent_hovered: store.sim.agent_hovered,
  // agent_selected: store.sim.agentSelected,
  // overlay: store.sim.overlay,
  player: Sim.player(store),
  playerReady: Sim.playerReady(store),
  // simLoaded: store.sim.markers && store.sim.overlays
});

const mapDispatchToProps = {
  joinSimulation: simOperations.join,
  leaveSimulation: simOperations.leave
}

export default connect(mapStateToProps, mapDispatchToProps)(Simulation)
