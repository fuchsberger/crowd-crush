import Player from '../components/player'
import { resize, pixelRatio } from '../helpers/canvas'

export default {
  mounted() {

    let canvas = document.getElementById('canvas')
    let context = canvas.getContext("2d")
    let data = this.el.dataset
    let loaded = false
    let aspectratio = JSON.parse(data.aspectratio)

    const player = new Player(data.video)

    player.player.on('playing', () => {
      if (!loaded) {
        this.pushEvent('set_duration', { duration: this.player.duration })
        this.pushEvent("control", { action: "stop" })
        loaded = true
      } else {
        this.pushEvent("control", { action: "playing" })
      }
    })

    Object.assign(this, { aspectratio, canvas, context, data, player })

    this.draw_agents()
  },

  updated() {
    // request an animation frame only when necessary, delete previous frame if in existance.
    if (this.animationFrameRequest) cancelAnimationFrame(this.animationFrameRequest)
    this.animationFrameRequest = requestAnimationFrame(() => {

      this.draw_agents()

      const time = this.player.time
      switch (this.el.dataset.action) {
        case 'play':
          this.player.play();
          break

        case 'pause':
          this.player.pause();
          this.pushEvent("ping", { action: "paused", time })
          break

        case 'stop':
          this.player.stop();
          this.pushEvent("ping", { action: "paused", time: 0 })
          break

        case 'backward':
          this.player.backward();
          this.pushEvent("ping", { action: "paused", time: time - 1 })
          break

        case 'forward':
          this.player.forward();
          this.pushEvent("ping", { action: "paused", time: time + 1 })
          break

        case 'playing':
          this.pushEvent("ping", { action: "playing", time })
      }
    })
  },

  draw_agents() {
    let { aspectratio, canvas, context, data } = this
    const agents = JSON.parse(data.agents)
    const selected = JSON.parse(data.selected)

    // should be done once in mount but for some reason properties don't persist there
    resize(aspectratio, canvas)

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

