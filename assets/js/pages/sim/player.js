import React from 'react'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'
import { YOUTUBE_PLAYER_OPTS } from '../../config'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

const Player = ({ changePlayerState, loadPlayer, overlay, youtubeID }) => overlay == 'white'
  ? null
  : <YouTube
      videoId={overlay || youtubeID}
      opts={{ ...YOUTUBE_PLAYER_OPTS, height: "100%", width: "100%" }}
      onReady={e => loadPlayer(e.target)}
      onStateChange={() => changePlayerState()}
      style={{ position: 'absolute' }}
    />

const mapStateToProps = store => ({
  overlay: Sim.overlay(store),
  youtubeID: Sim.youtubeID(store)
})
const mapDispatchToProps = {
  changePlayerState: simOperations.changePlayerState,
  loadPlayer: simOperations.loadPlayer
}
export default connect(mapStateToProps, mapDispatchToProps)(Player)
