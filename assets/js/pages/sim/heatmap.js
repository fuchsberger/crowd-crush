import React, { Component } from 'react'
import { connect } from 'react-redux'
import { simSelectors as Sim } from '../../modules/sim'
import h337 from 'heatmap.js'
import $ from 'jquery'

class Heatmap extends Component {
  constructor(props){
    super(props)
    this.heatmapInstance = null
  }

  componentDidMount(){
    this.heatmapInstance = h337.create({
      container: document.getElementById('overlay'),
      radius: 45,
      maxOpacity: .7,
      minOpacity: 0,
      blur: .75
    })
    this.forceUpdate()
  }

  componentWillUnmount(){
    $('canvas.heatmap-canvas').remove()
  }

  render(){
    if(this.heatmapInstance){
      // create heatmap with configuration
      this.heatmapInstance.setData({ max: 100, min: 0, data: this.props.mappedMarkers })
    }
    return null
  }
}

const mapStateToProps = state => ({ mappedMarkers: Sim.mappedMarkers(state) })
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Heatmap)
