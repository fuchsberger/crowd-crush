import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../modules/sim'
import { Overlay } from './sim'
import { Player } from '../components'

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

    if(!this.props.id) return <Dimmer active><Loader inverted/></Dimmer>

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
  id: Sim.video_id(store),
  player: Sim.player(store),
  playerReady: Sim.playerReady(store)
})

const mapDispatchToProps = {
  joinSimulation: simOperations.join,
  leaveSimulation: simOperations.leave
}

export default connect(mapStateToProps, mapDispatchToProps)(Simulation)
