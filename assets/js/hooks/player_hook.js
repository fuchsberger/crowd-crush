import YTPlayer from 'yt-player'

export default {
  mounted() {
    let loaded = false;
    const player = new YTPlayer(this.el, {
      annotations: false,
      captions: false,
      controls: false,
      fullscreen: false,
      keyboard: false,
      modestBranding: true,
      width: "100%",
      height: "100%",
    })
    player.load(this.el.dataset.video)
    player.mute()
    player.play()

    const hook = this
    player.on('playing', () => {
      if (!loaded) {
        player.pause()
        player.seek(0)
        hook.pushEvent("pause", { time: 0 })
        hook.pushEvent('set_duration', { duration: player.getDuration()})
        loaded = true
      } else {
        hook.pushEvent("play", { time: player.getCurrentTime() })
      }
    })
    player.on('paused', () => {
      // jumpt to closest second (round down) when pausing
      const time = parseInt(player.getCurrentTime())
      player.seek(time)
      hook.pushEvent("pause", { time })
    })

    player.on('ended', () => {
      loaded = false
      player.seek(0)
    })

    // play/pause button
    document.getElementById("btn-play").addEventListener('click', () => {
      player.getState() == 'playing' ? player.pause() : player.play()
    })

    // stop button
    document.getElementById("btn-stop").addEventListener('click', () => {
      if (player.getCurrentTime() != 0) {
        if(player.getState() == 'playing') player.pause()
        player.seek(0)
        hook.pushEvent("pause", { time: 0 })
      }
    })

    window.player = player
  }
}
