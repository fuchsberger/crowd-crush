import React from 'react'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'
import { YOUTUBE_PLAYER_OPTS } from '../config'

import { playerOperations } from '../modules/player'
import { simSelectors as Sim } from '../modules/sim'

const Player = ({ id, changeState, height, ready, width, overlay }) =>
  <YouTube
    videoId={overlay || id}
    opts={{ ...YOUTUBE_PLAYER_OPTS, height: `${height}px`, width: `${width}px`}}
    onReady={() => ready()}
    // onStateChange={() => changeState()}
  />

const mapStateToProps = store => ({
  height: Sim.video_height(store),
  width: Sim.video_width(store),
  overlay: Sim.overlay(store)
})
const mapDispatchToProps = {
  // changeState: playerOperations.changeState,
  ready: playerOperations.ready,
}
export default connect(mapStateToProps, mapDispatchToProps)(Player)
