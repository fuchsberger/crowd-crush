import React from 'react'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'
import { YOUTUBE_PLAYER_OPTS } from '../../config'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

const Player = ({ changePlayerState, loadPlayer, height, width, overlay, youtubeID }) => overlay == 'white'
  ? null
  : <YouTube
      videoId={overlay || youtubeID}
      opts={{ ...YOUTUBE_PLAYER_OPTS, height: `${height}px`, width: `${width}px`}}
      onReady={e => loadPlayer(e.target)}
      onStateChange={() => changePlayerState()}
    />

const mapStateToProps = store => ({
  height: Sim.video_height(store),
  width: Sim.video_width(store),
  overlay: Sim.overlay(store),
  youtubeID: Sim.youtubeID(store)
})
const mapDispatchToProps = {
  changePlayerState: simOperations.changePlayerState,
  loadPlayer: simOperations.loadPlayer,
}
export default connect(mapStateToProps, mapDispatchToProps)(Player)
