import React from 'react'
import { connect } from 'react-redux'
import { simSelectors as Sim } from '../../modules/sim'

const Robots = ({ robots, simulation }) => {
  return robots.map((robot, i) =>
    <div
      className={`marker ${simulation ? "" : "static" }`}
      key={robot.id}
      style={{ left: 100 * robot.x + "%", top: 100 * robot.y + "%" }}
    />
  )
}

const mapStateToProps = state => ({
  robots: Sim.robots(state)
})

export default connect(mapStateToProps)(Robots)
