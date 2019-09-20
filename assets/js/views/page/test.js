import $ from 'jquery'
import MainView from '../main'

// draws the canvas content
const drawHeatmap = canvas => {
  let ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(25, 25, 100, 100)
  ctx.clearRect(45, 45, 60, 60)
  ctx.strokeRect(50, 50, 50, 50)
}

// resize the canvas to fill browser window dynamically
const resize = () => {
  let canvas = $('#heatmap')[0]
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  drawHeatmap(canvas)
}

export default class View extends MainView {
  mount() {
    super.mount()

    // resize canvas and draw it for the first time
    resize()

    // listen vor page resize event
    window.addEventListener("resize", () => {
      if(this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(resize, 200);
    })
  }

  unmount() {
    super.unmount()
    window.removeEventListener("resize")
  }
}

