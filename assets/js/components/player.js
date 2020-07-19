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
  constructor(youtubeID, push) {
    const player = new YTPlayer(document.getElementById('player'), PLAYER_PARAMS)

    player.load(youtubeID)
    player.mute()
    player.play()

    document.getElementById('play').addEventListener('click', () => this.play())
    document.getElementById('pause').addEventListener('click', () => this.pause())
    document.getElementById('stop').addEventListener('click', () => this.stop())
    document.getElementById('backward').addEventListener('click', () => this.backward())
    document.getElementById('forward').addEventListener('click', () => this.forward())

    player.on('playing', () => {
      if (!this.loaded) {
        player.pause()
        player.seek(0)
        this.push('set', { duration: player.getDuration() })
        this.loaded = true
      }
    })

    this.loaded = false
    this._player = player
    this.push = push
  }

  get duration() { return this._player.getDuration() }
  get time() { return this._player.getCurrentTime() }
  get player() { return this._player }

  play() {
    this._player.play()

    // start event loop
    const loop = () => {
      window.animationRequest = requestAnimationFrame(loop)
      this.push('ping', {time: this.player.getCurrentTime()})
    }
    requestAnimationFrame(loop)
  }

  pause() {
    if (window.animationRequest) cancelAnimationFrame(window.animationRequest)

    const time = Math.floor(this._player.getCurrentTime())
    this._player.pause()
    this._player.seek(time)
    this.push('jump', {time})
  }

  stop() {
    if (window.animationRequest) cancelAnimationFrame(window.animationRequest)
    this._player.pause()
    this._player.seek(0)
    this.push('jump', {time: 0})
  }

  backward() {
    const time = this._player.getCurrentTime() - 1
    this._player.seek(time)
    this.push('jump', {time})
  }

  forward() {
    const time = this._player.getCurrentTime() + 1
    this._player.seek(time)
    this.push('jump', {time})
  }
}
