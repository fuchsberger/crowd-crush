import React from 'react'
import { connect } from 'react-redux'
import { Icon, Menu } from 'semantic-ui-react'
import { playerSelectors as Player } from '../../modules/player'
import { sceneSelectors as Scene } from '../../modules/scene'

const Time = ({ duration, time }) => (
  <Menu.Menu position='right'>
    <Menu.Item>
      <Icon name='clock outline' />
      {time}{duration && ` / ${duration}`}
    </Menu.Item>
  </Menu.Menu>
)

const mapStateToProps = store => ({
  duration: Scene.duration(store),
  time: Player.time(store)
})
export default connect(mapStateToProps)(Time)


