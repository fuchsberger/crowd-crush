import React from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

const Markers = ({ agents, hover, mode }) => agents.map(agent =>
  <div
    className={agent.class}
    key={agent.id}
    onMouseEnter={() => mode == 'markers' ? hover(agent.id) : null }
    onMouseLeave={() => mode == 'markers' ? hover(null) : null }
    style={{ left: 100 * agent.x+"%", top: 100 * agent.y+"%" }}
  />
)

const mapStateToProps = ( state, ownProps ) => ({
  // agents: ownProps.right
  //   ? Sim.getAbsPositionsSynthetic(state)
  //   : (
  //       ownProps.comparisonMode
  //       ? Sim.getAbsPositionsAnnotated(state)
  //       : Sim.agents(state)
  //     ),
  agents: Sim.displayed_agents(state),
  mode: Sim.mode(state)
})

const mapDispatchToProps = {
  hover: simOperations.hoverAgent
}

export default connect(mapStateToProps, mapDispatchToProps)(Markers)
