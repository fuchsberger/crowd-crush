import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

class OverlayItem extends Component {

  state = { open: false }

  toggle = () => this.setState({ open: !this.state.open })

  render(){
    const { overlays, overlayText, setOverlay } = this.props

    const overlay_list = overlays.map((o, i) =>
      <Dropdown.Item content={o.title} icon='youtube' key={i} onClick={() => setOverlay(o.youtubeID)} />)

    return (
      <Dropdown item icon='caret down' text={`Overlay: ${overlayText}`}>
        <Dropdown.Menu>
          <Dropdown.Item content='none' icon='ban' onClick={() => setOverlay(null)} />
          <Dropdown.Item content='Black & White' icon='blackberry' onClick={() => setOverlay('white')} />
          {overlay_list}
          <Dropdown.Divider />
          <Dropdown.Item content='Manage Overlays' icon='cog' />
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

const mapStateToProps = store => ({
  overlays: Sim.overlays(store),
  overlayText: Sim.overlayText(store)
})

const mapDispatchToProps = {
  setOverlay: simOperations.setOverlay
}

export default connect(mapStateToProps, mapDispatchToProps)(OverlayItem)
