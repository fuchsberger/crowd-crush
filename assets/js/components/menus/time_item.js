import React from 'react'
import { connect } from 'react-redux'
import { Icon, Menu } from 'semantic-ui-react'
import { simSelectors as Sim } from '../../modules/sim'

const TimeItem = ({ time }) => (
  <Menu.Item>
    <Icon name='clock outline' />
    {time}
  </Menu.Item>
)

const mapStateToProps = store => ({ time: Sim.time(store) })
export default connect(mapStateToProps)(TimeItem)


