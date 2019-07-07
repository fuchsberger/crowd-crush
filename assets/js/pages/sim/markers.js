import React from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

const Markers = ({ agents, agentSelected, comparisonMode, hover, mode, overlay }) => (
  Object.keys(agents).map(( i ) => {
    const id = parseInt(i)
    let className = 'marker'
    if(comparisonMode || overlay == 'white') className += ' static'
    if(id == agentSelected) className += ' selected'

    return (
      <div
        key={id}
        className={ className }
        onMouseEnter={() => mode == 'markers' ? hover(id) : null }
        onMouseLeave={() => mode == 'markers' ? hover(null) : null }
        style={{
          left: 100 * agents[i].x+"%",
          top: 100 * agents[i].y+"%"
        }}
      />
    )
  })
)

const mapStateToProps = ( state, ownProps ) => ({
  agents: ownProps.right
    ? Sim.getAbsPositionsSynthetic(state)
    : (
        ownProps.comparisonMode
        ? Sim.getAbsPositionsAnnotated(state)
        : Sim.agents(state)
      ),
  agentSelected: state.sim.agentSelected,
  mode: Sim.mode(state),
  overlay: Sim.overlay(state)
})

const mapDispatchToProps = {
  hover: simOperations.hoverAgent
}

export default connect(mapStateToProps, mapDispatchToProps)(Markers)
