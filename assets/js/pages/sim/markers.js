import React from 'react'
import { connect } from 'react-redux'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

const Markers = ({ agents, edit, hover }) => agents.map((agent, i) =>
  <div
    className={agent.class}
    key={agent.id}
    onMouseEnter={() => edit ? hover(agent.id) : null }
    onMouseLeave={() => edit ? hover(null) : null }
    style={{ left: 100 * agent.x+"%", top: 100 * agent.y+"%" }}
  />
)

const mapStateToProps = state => ({
  // agents: ownProps.right
  //   ? Sim.getAbsPositionsSynthetic(state)
  //   : (
  //       ownProps.comparisonMode
  //       ? Sim.getAbsPositionsAnnotated(state)
  //       : Sim.agents(state)
  //     ),
  agents: Sim.agents(state)
})

const mapDispatchToProps = {
  hover: simOperations.hoverAgent
}

export default connect(mapStateToProps, mapDispatchToProps)(Markers)
