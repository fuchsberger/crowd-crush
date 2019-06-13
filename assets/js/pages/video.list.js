import React from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash/collection'
import TimeAgo from 'react-timeago'
import { Container, Table } from 'semantic-ui-react'
import { videoOperations as Video, videoSelectors } from '../modules/video'

const VideoList = ({ history, sort, sortColumn, sortDirection, videos }) => (
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
            sorted={sortColumn === 'marker_count' ? sortDirection : null}
            onClick={() => sort('marker_count')}
          >
            Markers
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={sortColumn === 'inserted_at' ? sortDirection : null}
            onClick={() => sort('inserted_at')}
          >
            Created
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {map(videos, ({ id, title, marker_count, inserted_at }) => (
          <Table.Row key={id} onClick={() => history.push(`/videos/${id}`)}>
            <Table.Cell>{title}</Table.Cell>
            <Table.Cell>{marker_count}</Table.Cell>
            <Table.Cell><TimeAgo date={inserted_at} /></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Container>
)

const mapStateToProps = store => ({
  sortColumn: videoSelectors.sortColumn(store),
  sortDirection: videoSelectors.sortDirection(store),
  videos: videoSelectors.videos(store)
})
const mapDispatchToProps = { sort: Video.sort }
export default connect(mapStateToProps, mapDispatchToProps)(VideoList)
