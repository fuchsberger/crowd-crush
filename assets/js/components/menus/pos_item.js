import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { simSelectors as Sim } from '../../modules/sim'

const PositionItem = ({ x, y }) => <Menu.Item icon='crosshairs' content={` ${x} / ${y}`} />

const mapStateToProps = store => ({
  x: Sim.x(store),
  y: Sim.y(store)
})
export default connect(mapStateToProps)(PositionItem)


