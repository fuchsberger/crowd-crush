import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Dimmer, Loader } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../modules/sim'
import { Overlay, Player } from './sim'

class Simulation extends Component {

  // showOverlayMenu: false,
  // showOverlayModal: false,

  componentDidMount() {
    this.props.joinSimulation(parseInt(this.props.match.params.id), this.props.history.push)
  }

  componentWillUnmount() {
    this.props.leaveSimulation(this.props.history.push)
  }

  render() {
    const { id, height, width } = this.props

    if(!id) return <Dimmer active><Loader inverted/></Dimmer>

    return <div className='video-wrapper'>
      <Player/>
      <Overlay />
      {/* modal={showOverlayModal} /> */}
      {/* <ModalOverlays /> */}
      {!this.props.playerReady && <Dimmer active><Loader inverted/></Dimmer>}
    </div>
  }
}

const mapStateToProps = store => ({
  player: Sim.player(store),
  playerReady: Sim.playerReady(store),
  id: Sim.video_id(store),
  height: Sim.video_height(store),
  width: Sim.video_width(store)
});

const mapDispatchToProps = {
  joinSimulation: simOperations.join,
  leaveSimulation: simOperations.leave
}

export default connect(mapStateToProps, mapDispatchToProps)(Simulation)
