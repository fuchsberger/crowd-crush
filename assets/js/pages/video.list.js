import React from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash/collection'
import TimeAgo from 'react-timeago'
import { Container, Icon, Table } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../modules/session'
import { videoOperations, videoSelectors as Video } from '../modules/video'

const VideoList = ({
  authenticated,
  sort,
  sortColumn,
  sortDirection,
  updateVideo,
  videos
}) => (
  <Container>
    {}
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
          {authenticated && <Table.HeaderCell>Actions</Table.HeaderCell>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {map(videos, ({ id, duration, title, inserted_at, youtubeID }) => (
          <Table.Row key={id}>
            {/* onClick={() => history.push(`/videos/${id}`)} */}
            <Table.Cell>{title}</Table.Cell>
            <Table.Cell>{duration}</Table.Cell>
            <Table.Cell><TimeAgo date={inserted_at} /></Table.Cell>
            {authenticated &&
              <Table.Cell>
                <Icon
                  name='refresh'
                  onClick={() => updateVideo(id, youtubeID)}
                  title='Get updated aspectratio and duration from YouTube'
                />
              </Table.Cell>
            }
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Container>
)

const mapStateToProps = store => ({
  authenticated: Session.isAuthenticated(store),
  sortColumn: Video.sortColumn(store),
  sortDirection: Video.sortDirection(store),
  videos: Video.getSorted(store)
})
const mapDispatchToProps = {
  updateVideo: videoOperations.update,
  sort: videoOperations.sort
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoList)
