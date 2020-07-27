import YTPlayer from 'yt-player'

const PLAYER_PARAMS = {
  annotations: false,
  captions: false,
  controls: false,
  fullscreen: false,
  keyboard: false,
  modestBranding: true,
  related: false,
  width: "100%",
  height: "100%",
}

export default class Player {
  constructor(youtubeID, push) {
    const player = new YTPlayer(document.getElementById('player'), PLAYER_PARAMS)

    player.load(youtubeID)
    player.mute()

    document.getElementById('play').addEventListener('click', () => player.play())
    document.getElementById('pause').addEventListener('click', () => player.pause())
    document.getElementById('stop').addEventListener('click', () => player.stop())
    document.getElementById('backward').addEventListener('click', () => this.backward())
    document.getElementById('forward').addEventListener('click', () => this.forward())

    // state after loading and when stopped
    player.on('cued', () => {
      if(window.animationRequest) cancelAnimationFrame(window.animationRequest)
      this.push('jump', { time : 0, stopped: true })
    })

    player.on('playing', () => {
      document.getElementById('backward').disabled = false

      const loop = () => {
        window.animationRequest = requestAnimationFrame(loop)
        this.push('ping', {time: this.player.getCurrentTime()})
      }
      requestAnimationFrame(loop)
    })

    player.on('paused', () => {
      cancelAnimationFrame(window.animationRequest)
      const time = Math.floor(player.getCurrentTime())
      player.seek(time)
      this.push('jump', { time, stopped: false })
    })

    this._player = player
    this.push = push
  }

  get duration() { return this._player.getDuration() }
  get time() { return this._player.getCurrentTime() }
  get player() { return this._player }

  backward() {
    if(this._player.getState() != 'paused') return
    if(window.animationRequest) cancelAnimationFrame(window.animationRequest)
    const time = this._player.getCurrentTime() - 1
    this._player.seek(time)
    this.push('jump', { time, stopped: false })
  }

  forward() {
    if(this._player.getState() != 'paused') return
    if(window.animationRequest) cancelAnimationFrame(window.animationRequest)
    const time = this._player.getCurrentTime() + 1
    this._player.seek(time)
    this.push('jump', { time, stopped: false })
  }

  getTime(){
    return this.player.getCurrentTime()
  }
}
