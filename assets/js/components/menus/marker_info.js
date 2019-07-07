import React from 'react'
import { connect } from 'react-redux'
import { Menu, Popup } from 'semantic-ui-react'
import { simSelectors as Sim } from '../../modules/sim'
import { LoginItem, PositionItem, TimeItem } from './'

const MarkerInfo = ({ agentCount, agentSelected }) => (
  <Menu.Menu position='right'>
    <PositionItem />
    <Popup
      inverted
      trigger={
        <Menu.Item
          icon={{ name: 'user', color: agentSelected != null ? 'teal' : null }}
          content={agentSelected != null
            ? ` ${agentSelected} / ${agentCount}`
            : `-- / ${agentCount}`
          }
        />
      }
      header='Selected Agent / # of Agents'
      content='To select an agent: Hover agent and press S'
      position='bottom center'
    />
    <TimeItem />
    <LoginItem />
  </Menu.Menu>
)

const mapStateToProps = store => ({
  agentCount: Sim.agentCount(store),
  agentSelected: Sim.agentSelected(store)
})
export default connect(mapStateToProps)(MarkerInfo)
