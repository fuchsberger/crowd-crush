import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Form, Input, Modal, Table } from 'semantic-ui-react'
import { YOUTUBE_URL_REGEX } from '../../config'
import { sessionSelectors as Session } from '../../modules/session'
import { simOperations, simSelectors as Sim } from '../../modules/sim'

class OverlayItem extends Component {

  state = { open: false, modal: true, title: '', youtubeID: null }

  changeUrl = e => {
    const match = e.target.value.match(YOUTUBE_URL_REGEX)
    const id = match && match[7].length == 11 ? match[7] : false
    this.setState({ youtubeID: id || false })
  }
  changeTitle = e => this.setState({ title: e.target.value })
  close = () => this.setState({ modal: false })
  show = () => this.setState({ modal: true })
  toggle = () => this.setState({ open: !this.state.open })

  render(){
    const { authenticated, createOverlay, deleteOverlay, overlays, overlayText, setOverlay, simChannel } = this.props
    const { title, youtubeID } = this.state

    const overlay_list = overlays.map((o, i) =>
      <Dropdown.Item content={o.title} icon='youtube' key={i} onClick={() => setOverlay(o.youtubeID)} />)

    return (
      <Dropdown item icon='caret down' text={`Overlay: ${overlayText}`}>
        <Dropdown.Menu>
          <Dropdown.Item content='none' icon='ban' onClick={() => setOverlay(null)} />
          <Dropdown.Item content='Black & White' icon='blackberry' onClick={() => setOverlay('white')} />
          {overlay_list}

          { authenticated && [
            <Dropdown.Divider key={0}/>,
            <Dropdown.Item content='Manage Overlays' icon='cog' key={1} onClick={this.show} />,
            <Modal key={2} size='tiny' open={this.state.modal} closeIcon onClose={this.close}>
              <Modal.Header>Manage Overlays</Modal.Header>
              <Modal.Content className='table'>
                <Table compact>
                  <Table.Body>
                    {
                      overlays.map(o =>
                      <Table.Row key={o.id}>
                        <Table.Cell>{o.title}</Table.Cell>
                        <Table.Cell
                          icon='trash'
                          onClick={() => deleteOverlay(o.id)}
                          textAlign='right'
                        />
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </Modal.Content>
              <Modal.Actions>
                {youtubeID
                  ? <Input
                      action={{
                        icon: 'plus',
                        content: 'Add Overlay',
                        onClick: () => createOverlay(simChannel, { title, youtubeID })
                      }}
                      onChange={this.changeTitle}
                      fluid
                      placeholder='Overlay Title'
                      value={title}
                    />
                  : <Input
                      action={{
                        disabled: true,
                        icon: 'plus',
                        content: 'Add Overlay'
                      }}
                      error={youtubeID == false}
                      onChange={this.changeUrl}
                      fluid
                      placeholder='Paste Youtube URL here...'
                      value=''
                    />
                }
                {/* */}
                {/* <Button negative>No</Button>
                <Button positive icon='checkmark' labelPosition='right' content='Yes' /> */}
              </Modal.Actions>
            </Modal>
          ]}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

const mapStateToProps = store => ({
  authenticated: Session.isAuthenticated(store),
  simChannel: Sim.channel(store),
  overlays: Sim.overlays(store),
  overlayText: Sim.overlayText(store)
})

const mapDispatchToProps = {
  createOverlay: simOperations.createOverlay,
  deleteOverlay: simOperations.deleteOverlay,
  setOverlay: simOperations.setOverlay
}

export default connect(mapStateToProps, mapDispatchToProps)(OverlayItem)
