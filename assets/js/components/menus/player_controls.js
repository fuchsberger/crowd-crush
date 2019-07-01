import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'
import { OverlayItem } from '.'

const PlayerControls = ({ play, pause, playing, stop }) => (
  <Menu.Menu>
    {playing
      ? <Menu.Item icon='pause' onClick={() => pause()}/>
      : <Menu.Item icon='play' onClick={() => play()}/>
    }
    <Menu.Item icon='stop' onClick={() => stop()} />
    <OverlayItem />
  </Menu.Menu>
)

const mapStateToProps = store => ({ playing: Sim.playing(store) })

const mapDispatchToProps = {
  play: simOperations.play,
  pause: simOperations.pause,
  stop: simOperations.stop
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerControls)
