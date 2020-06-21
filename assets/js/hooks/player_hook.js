import YTPlayer from 'yt-player'

export default {
  mounted() {

    const player = new YTPlayer(this.el, {
      annotations: false,
      captions: false,
      controls: false,
      fullscreen: false,
      keyboard: false,
      modestBranding: false,
      width: "100%",
      height: "100%",
    })
    player.load(this.el.dataset.video)

    // inform server that video has been paused
    const hook = this
    player.on('playing', () => hook.pushEvent("play", {}))
    player.on('paused', () => hook.pushEvent("pause", {}))

    // enable controls
    document.getElementById("btn-play").addEventListener('click', () => {
      player.getState() == 'playing' ? player.pause() : player.play()
    })
    document.getElementById("btn-stop").addEventListener('click', () => {
      player.pause()
      player.seek(0)
    })

    this.player = player
  }
}
