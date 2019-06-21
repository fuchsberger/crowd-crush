import React from 'react'
import { connect } from 'react-redux'
import { simSelectors as Sim } from '../../modules/sim'

const SimTime = ({ time }) => <span>{time}</span>

const mapStateToProps = store => ({ time: Sim.time(store) })
export default connect(mapStateToProps)(SimTime)
