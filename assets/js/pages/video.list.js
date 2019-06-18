import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { map } from 'lodash/collection'
import TimeAgo from 'react-timeago'
import { Button, Confirm, Container, Table } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../modules/session'
import { videoOperations, videoSelectors as Video } from '../modules/video'

class VideoList extends Component {
  state = { id: null, open: false }

  open = id => this.setState({ id, open: true })
  close = () => this.setState({ id: null, open: false })

  delete = () => {
    this.props.deleteVideo(this.state.id)
    this.close()
  }

  render(){

    const {
      authenticated,
      sort,
      sortColumn,
      sortDirection,
      updateVideo,
      videos
      } = this.props

    return (
      <Container>
        <Table compact selectable sortable fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={sortColumn === 'title' ? sortDirection : null}
                onClick={() => sort('title')}
              >
                Title
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sortColumn === 'duration' ? sortDirection : null}
                onClick={() => sort('duration')}
              >
                Duration
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sortColumn === 'inserted_at' ? sortDirection : null}
                onClick={() => sort('inserted_at')}
              >
                Created
              </Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {map(videos, ({ id, duration, title, inserted_at, youtubeID }) => (
              <Table.Row key={id}>
                {/* onClick={() => history.push(`/videos/${id}`)} */}
                <Table.Cell>
                  <Link to={`/simulation/${id}`}>{title}</Link>
                </Table.Cell>
                <Table.Cell>{duration}</Table.Cell>
                <Table.Cell><TimeAgo date={inserted_at} /></Table.Cell>

                <Table.Cell>
                  <a href={`https://www.youtube.com/watch?v=${youtubeID}`} target='_blank'>
                    <Button icon='youtube' size='mini' />
                  </a>
                  {authenticated && [
                  <Button
                    icon='refresh'
                    key={1}
                    onClick={() => updateVideo(id, youtubeID)}
                    size='mini'
                    title='Get updated aspectratio and duration from YouTube'
                  />,
                  <Button
                    key={2}
                    icon='delete'
                    onClick={() => this.open(id)}
                    size='mini'
                    title='Remove Video and all associated markers and overlays'
                  />]
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Confirm
          confirmButton='Delete'
          content='Are you sure? This will also delete all associated markers and overlays!'
          open={this.state.open}
          onCancel={this.close}
          onConfirm={this.delete}
        />
      </Container>
    )
  }
}

const mapStateToProps = store => ({
  authenticated: Session.isAuthenticated(store),
  sortColumn: Video.sortColumn(store),
  sortDirection: Video.sortDirection(store),
  videos: Video.getSorted(store)
})
const mapDispatchToProps = {
  deleteVideo: videoOperations.delete_one,
  updateVideo: videoOperations.update,
  sort: videoOperations.sort
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoList)
