import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { sceneSelectors as Scene } from '../../modules/scene'
import { simOperations, simSelectors as Sim } from '../../modules/sim'


const MapSpawnControls = ({ count, dimensions, spawn }) => (
  <Menu.Menu>
    <Menu.Item content='Spawn Agents' icon='add' onClick={() => spawn(dimensions, count)}/>
  </Menu.Menu>
)

const mapStateToProps = store => ({
  count: Sim.currentCount(store),
  dimensions: Scene.dimensions(store)
})

const mapDispatchToProps = {
  spawn: simOperations.spawn
}

export default connect(mapStateToProps, mapDispatchToProps)(MapSpawnControls)
