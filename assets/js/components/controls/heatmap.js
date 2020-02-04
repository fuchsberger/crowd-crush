import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { simOperations } from '../../modules/sim'

const HeatMapControls = ({ mode, spawn }) => (
  <Menu.Menu>
    <Menu.Item content='Spawn Agents' icon='add' onClick={() => spawn()}/>
  </Menu.Menu>
)

const mapStateToProps = () => ({

})

const mapDispatchToProps = {
  mode: simOperations.setMode,
  spawn: simOperations.spawn
}

export default connect(mapStateToProps, mapDispatchToProps)(HeatMapControls)
