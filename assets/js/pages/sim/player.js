import React, { Component } from 'react'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'
import { YOUTUBE_PLAYER_OPTS } from '../../config'
import { sceneSelectors as Scene } from '../../modules/scene'
import { playerOperations } from '../../modules/player'
import { simSelectors as Sim } from '../../modules/sim'

class Player extends Component {
  componentWillUnmount() {
    this.props.leave()
  }

  render() {
    const { id, changeState, dimensions, ready, overlay } = this.props
    return (
      <YouTube
        videoId={overlay || id}
        opts={{
          ...YOUTUBE_PLAYER_OPTS,
          height: `${dimensions[1]}px`,
          width: `${dimensions[0]}px`
        }}
        onReady={e => ready(e.target)}
        onStateChange={() => changeState()}
      />
    )
  }
}
const mapStateToProps = store => ({
  dimensions: Scene.dimensions(store),
  id: Scene.id(store),
  overlay: Sim.overlay(store)
})

const mapDispatchToProps = {
  changeState: playerOperations.changeState,
  ready: playerOperations.ready,
  leave: playerOperations.leave
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
