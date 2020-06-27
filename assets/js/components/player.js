import YTPlayer from 'yt-player'

const PLAYER_PARAMS = {
  annotations: false,
  captions: false,
  controls: false,
  fullscreen: false,
  keyboard: false,
  modestBranding: true,
  width: "100%",
  height: "100%",
}

export default class Player {
  constructor(youtubeID) {
    // do not play the simulation on loading
    this._player = new YTPlayer(document.getElementById('player'), PLAYER_PARAMS)
    this._player.load(youtubeID)
    this._player.mute()
    this._player.play()
  }

  get duration() {
    return this._player.getDuration()
  }

  get time() {
    return this._player.getCurrentTime()
  }

  get player() {
    return this._player
  }

  play() {
    this._player.play()
  }

  pause() {
    // pauses at the closest completed minute mark
    this._player.seek(Math.floor(this._player.getCurrentTime()))
    this._player.pause()
  }

  stop() {
    this._player.pause()
    this._player.seek(0)
  }

  backward() {
    // only possible while paused
    this._player.seek(Math.max(0, this._player.getCurrentTime() - 1))
  }

  forward() {
    // only possible while paused
    this._player.seek(Math.min(this._player.getDuration(), this._player.getCurrentTime() + 1))
  }
}

