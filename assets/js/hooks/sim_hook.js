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

export default {
  mounted() {

    let canvas = document.getElementById('canvas')
    let context = canvas.getContext("2d")
    let data = this.el.dataset
    let loaded = false;
    let ratio = getPixelRatio(context)
    let aspectratio = JSON.parse(data.aspectratio)

    const player = new YTPlayer(document.getElementById('player'), PLAYER_PARAMS)

    player.load(data.video)
    player.mute()
    player.play()

    player.on('playing', () => {
      if (!loaded) {
        this.pushEvent('set_duration', { duration: player.getDuration()})
        this.pushEvent("control", { action: "stop" })
        loaded = true
      } else {
        this.pushEvent("control", { action: "playing" })
      }
    })

    player.on('paused', () => {
      const time = Math.floor(player.getCurrentTime())
      this.player.seek(time)
      this.pushEvent("ping", { time })
    })

    player.on('ended', () => hook.pushEvent("control", { action: "stop" }))

    // add key controls
    const hook = this
    document.addEventListener('keydown', e => {
      let time = player.getCurrentTime()
      switch (e.keyCode) {
        case 65: // (a) backward
          if (time <= 0) break
          time--
          player.seek(time)
          hook.pushEvent("pause", { time })
          break

        case 68: // (d) forward
          if(time > player.getDuration()- 1) break
          time++
          player.seek(time)
          hook.pushEvent("pause", { time })
          break

        case 83: // (s)  deselect
          if (JSON.parse(document.getElementById('canvas-wrapper').dataset.selected))
            hook.pushEvent("deselect")
          break
      }
    })

    Object.assign(this, { aspectratio, canvas, context, data, ratio, player })

    this.draw_agents()
  },

  updated() {
    let time = this.player.getCurrentTime()

    switch (this.el.dataset.action) {
      case 'play':
        this.player.play()
        break

      case 'playing':
        const hook = this
        // guard to ensure rendering keeps up with updates
        if (this.animationFrameRequest) cancelAnimationFrame(this.animationFrameRequest)

        // request an animation frame only when necessary
        this.animationFrameRequest = requestAnimationFrame(() => {
          this.draw_agents()
          if (!JSON.parse(data.paused))
            hook.pushEvent("ping", { time: window.player.getCurrentTime() })
        })
        break

      case 'pause':
        this.player.pause()
        break

      case 'stop':
        this.pushEvent("control", { action: "pause" })
        this.player.seek(0)
        this.player.pause()
        break

      case 'backward':
        this.pushEvent("control", { action: "pause" })
        time--
        this.player.seek(time)
        this.pushEvent("ping", { time })
        break

      case 'forward':
        this.pushEvent("control", { action: "pause" })
        time++
        this.player.seek(time)
        this.pushEvent("ping", { time })
        break
    }
  },

  draw_agents() {
    let { aspectratio, canvas, context, data, ratio } = this
    const agents = JSON.parse(data.agents)
    const selected = JSON.parse(data.selected)

    // should be done once in mount but for some reason properties don't persist there
    resize(aspectratio, canvas, ratio)

    context.clearRect(0, 0, canvas.width, canvas.height);


    for (let [agent, position] of Object.entries(agents)) {
      if (position) {

        context.fillStyle = selected == agent ? "rgba(0, 255, 208, 1)" : "rgba(0, 255, 0, 1)"

        context.beginPath()
        context.arc(
          canvas.width * position[0],
          canvas.height * position[1],
          5,
          0,
          2 * Math.PI
        )
        context.fill()
      }
    }
  }
}

const getPixelRatio = context => {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
}

const resize = (aspectratio, canvas, ratio) => {

  const screen_w = window.innerWidth * ratio
  const screen_h = (window.innerHeight - 103) * ratio
  let w = screen_w
  let h = screen_h

  // screen is wider than video -> fix height and get scaled width
  if (w / h > aspectratio) w = h * aspectratio
  else h = w / aspectratio

  // calculate left/top offset
  const t = h < screen_h ? 56 + (screen_h - h) / 2 : 56
  const l = w < screen_w ? (screen_w - w) / 2 : 0

  // update canvas
  canvas.width = w;
  canvas.height = h;
  canvas.style.position = 'fixed'
  canvas.style.top = `${t}px`
  canvas.style.left = `${l}px`
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
}
