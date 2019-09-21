import $ from 'jquery'
import h337 from 'heatmap.js'
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
  // drawHeatmap(canvas)
}

export default class View extends MainView {
  mount() {
    super.mount()

    // configure heatmap
    var config = {
      container: $('body')[0],
      radius: 45,
      maxOpacity: .8,
      minOpacity: 0,
      blur: .75
    }

    // create heatmap with configuration
    var heatmapInstance = h337.create(config)

    // create data points
    let datapoints = []
    for(let i=0; i<500; i++){
      datapoints.push({
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
        value: Math.floor(Math.random() * 101)
      })
    }

    var data = { max: 100, min: 0, data: datapoints }

    heatmapInstance.setData(data)

    // resize canvas and draw it for the first time
    // resize()

    // listen for page resize event
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

