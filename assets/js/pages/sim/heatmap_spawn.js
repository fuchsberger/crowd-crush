import React from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

class HeatmapSpawn extends React.Component {
  constructor(props){
    super(props)
    this.heatmapInstance = null
  }

  componentDidMount(){
    this.props.setHeatMap()
  }

  componentWillUnmount(){
    document.getElementsByTagName('canvas')[0].remove()
  }

  render() {
    const { heatMap, mappedMarkers } = this.props

    if (heatMap) {
      // create heatmap with configuration
      heatMap.setData({ max: 100, min: 0, data: mappedMarkers })
    }
    return null
  }
}

const mapStateToProps = state => ({
  heatMap: Sim.heatMap(state),
  mappedMarkers: Sim.mappedMarkers(state)
})
const mapDispatchToProps = {
  setHeatMap: simOperations.setHeatMap
}

export default connect(mapStateToProps, mapDispatchToProps)(HeatmapSpawn)
