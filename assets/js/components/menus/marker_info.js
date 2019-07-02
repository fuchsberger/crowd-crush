import React from 'react'
import { connect } from 'react-redux'
import { Menu, Popup } from 'semantic-ui-react'
import { simSelectors as Sim } from '../../modules/sim'
import { LoginItem, TimeItem } from './'

const MarkerInfo = ({ agentSelected }) => (
  <Menu.Menu position='right'>
    <Popup
      inverted
      trigger={<Menu.Item icon='user' content={agentSelected || '-'} />}
      header='Selected Agent'
      content='To select an agent: Hover agent and press SPACE'
      position='bottom center'
    />
    <TimeItem />
    <LoginItem />
  </Menu.Menu>
)

const mapStateToProps = store => ({
  agentSelected: Sim.agentSelected(store)
})
export default connect(mapStateToProps)(MarkerInfo)
