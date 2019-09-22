import React, { Component } from 'react'
import { connect } from 'react-redux'
import { simSelectors as Sim } from '../../modules/sim'
import h337 from 'heatmap.js'
import $ from 'jquery'

class Overlay extends Component {

  componentDidMount(){
    // configure heatmap
    var config = {
      container: $('.overlay')[0],
      radius: 45,
      maxOpacity: .8,
      minOpacity: 0,
      blur: .75
    }

    // create data points
    let datapoints = []
    for(let i=0; i<300; i++){
      datapoints.push({
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
        value: Math.floor(Math.random() * 101)
      })
    }

    var data = { max: 100, min: 0, data: datapoints }

    setTimeout(() => {
      // create heatmap with configuration
      this.heatmapInstance = h337.create(config)
      this.heatmapInstance.setData(data)
    }, 1000)
  }

  componentWillUnmount(){
    $('canvas.heatmap-canvas').remove()
  }

  render(){
    return null
  }
}

const mapStateToProps = state => ({
  mode: Sim.mode(state)
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Overlay)
