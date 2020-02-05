import React from 'react'
import { connect } from 'react-redux'
import { Menu, Popup } from 'semantic-ui-react'
import { simSelectors as Sim } from '../../modules/sim'

const MarkerInfo = ({ agentCount, agentSelected }) => (
  <Menu.Menu>
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
      content='Selected Agent / # of Agents (Hotkey: S)'
      position='bottom center'
    />
  </Menu.Menu>
)

const mapStateToProps = store => ({
  agentCount: Sim.agentCount(store),
  agentSelected: Sim.agentSelected(store)
})
export default connect(mapStateToProps)(MarkerInfo)
