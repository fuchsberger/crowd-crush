import React from 'react'
import { connect } from 'react-redux'
import { simOperations as Sim, simSelectors } from '../../modules/sim'

const Markers = ({ agents, agentSelected, comparisonMode, update }) => (
  Object.keys(agents).map(( i ) => {
    const id = parseInt(i)
    let className = 'marker'
    if(comparisonMode) className += ' static'
    if(id == agentSelected) className += ' selected'

    return (
      <div
        key={id}
        className={ className }
        onMouseEnter={() => update({ agentHovered: id })}
        onMouseLeave={() => update({ agentHovered: null })}
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
    ? simSelectors.getAbsPositionsSynthetic(state)
    : (
        ownProps.comparisonMode
        ? simSelectors.getAbsPositionsAnnotated(state)
        : simSelectors.getRelPositions(state)
      ),
  agentSelected: state.sim.agentSelected
})

const mapDispatchToProps = {
  update: Sim.update
}

export default connect(mapStateToProps, mapDispatchToProps)(Markers)
