import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { Loader } from 'semantic-ui-react'
import { Button, Confirm, Container, Table } from 'semantic-ui-react'
import { sessionSelectors as Session } from '../modules/session'
import { videoOperations, videoSelectors as Video } from '../modules/video'

class VideoList extends Component {

  state = { id: null, open: false }

  componentDidMount() {
    if(!this.props.videos) this.props.load_videos()
  }

  // open = id => this.setState({ id, open: true })
  // close = () => this.setState({ id: null, open: false })

  // delete = () => {
  //   this.props.deleteVideo(this.state.id)
  //   this.close()
  // }

  render_row(video) {
    return (
      <Table.Row key={video.id}>
        {/* onClick={() => history.push(`/videos/${id}`)} */}
        <Table.Cell>
          <Link to={`/scene/${video.youtubeID}/watch`}>{video.title}</Link>
        </Table.Cell>
        <Table.Cell>{video.duration}</Table.Cell>
        <Table.Cell>
          <Button
            as='a'
            compact
            icon='youtube'
            href={`https://www.youtube.com/watch?v=${video.youtubeID}`}
            target='_blank'
            title='Get updated aspectratio and duration from YouTube'
          />

          {this.props.authenticated && [
            <Button
              key={1}
              compact
              icon='refresh'
              onClick={() => updateVideo(video.id, video.youtubeID)}
              title='Get updated aspectratio and duration from YouTube'
            />,
            <Button
              key={2}
              compact
              color='red'
              icon='cancel'
              onClick={() => this.open(video.id)}
              title='Remove Video and all associated markers and overlays'
            />]
          }
        </Table.Cell>
      </Table.Row>
    )
  }

  render() {

    if(!this.props.videos) return <Loader/>

    return (
      <Container>
        <Table compact selectable fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.props.videos.map(video => this.render_row(video)) }
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
  videos: Video.list(store)
})

const mapDispatchToProps = {
  // deleteVideo: videoOperations.delete_one,
  load_videos: videoOperations.load,
  // updateVideo: videoOperations.update
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoList)
