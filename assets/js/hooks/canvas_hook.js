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

export default {
  mounted() {

    let canvas = this.el.firstElementChild
    let context = canvas.getContext("2d")
    let ratio = getPixelRatio(context)
    let wrapper = this.el
    let aspectratio = JSON.parse(wrapper.dataset.aspectratio)

    Object.assign(this, { aspectratio, canvas, context, ratio, wrapper })

    this.draw_agents()
  },

  updated() {
    // guard to ensure rendering keeps up with updates
    if (this.animationFrameRequest) cancelAnimationFrame(this.animationFrameRequest)

    // request an animation frame only when necessary
    this.animationFrameRequest = requestAnimationFrame(() => {
      this.draw_agents()
      this.pushEvent("ping", { time: window.player.getCurrentTime() })
    })
  },

  draw_agents() {
    let { aspectratio, canvas, context, ratio, wrapper } = this
    const agents = JSON.parse(wrapper.dataset.agents)

    // should be done once in mount but for some reason properties don't persist there
    resize(aspectratio, canvas, ratio)

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(0, 255, 0, 1)";

    for (let [agent, position] of Object.entries(JSON.parse(wrapper.dataset.agents))) {
      if (position) {
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
