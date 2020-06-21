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

const resize = (canvas, ratio) => {
  canvas.width = window.innerWidth * ratio;
  canvas.height = (window.innerHeight - 112) * ratio;
  canvas.style.position = 'fixed'
  canvas.style.top = '56px'
  canvas.style.left = '0'
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight - 112}px`;
}

export default {
  mounted() {
    let canvas = this.el.firstElementChild
    let context = canvas.getContext("2d")
    let ratio = getPixelRatio(context)
    let wrapper = this.el

    Object.assign(this, { canvas, context, ratio, wrapper })
  },

  updated() {
    let { canvas, context, ratio, wrapper } = this

    // should be done once in mount but for some reason properties don't persist there
    resize(canvas, ratio)

    // this.pushEvent("ping", { time: window.player.getCurrentTime() })

    // guard to ensure rendering keeps up with updates
    if (this.animationFrameRequest) cancelAnimationFrame(this.animationFrameRequest)

    // request an animation frame only when necessary
    this.animationFrameRequest = requestAnimationFrame(() => {
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
    })
  }
}
