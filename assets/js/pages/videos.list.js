import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash/collection'
import { Container, Table } from 'semantic-ui-react'
import Loading from '../components/loading'
import { videoOperations as Video, videoSelectors } from '../modules/video'

class VideosList extends Component {

  // constructor(props) {
  //   super(props);

  //   // bindings
  //   this.filter = this.filter.bind(this);
  //   this.deleteVideos = this.deleteVideos.bind(this);
  //   this.updateState = this.updateState.bind(this);

  // deleteVideos(){
  //   const video_ids = this.state.selection
  //   var r = confirm(`Are you sure you want to delete ${video_ids.length} videos?`)
  //   if(r) this.props.deleteVideos(video_ids)
  // }

  // updateState(nState) {
  //   this.setState({ ...this.state, ...nState });
  // }

  render() {

    const { loading, sort, sortColumn, sortDirection, videos } = this.props

    if(loading) return <Loading />

    // const { isAuthentificated, history, ready, updateVideos } = this.props;
    // const { deleteVideos, updateState } = this;

    return (
      <Container>
        <Table compact sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={sortColumn === 'title' ? sortDirection : null}
                onClick={() => sort('title')}
              >
                Title
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sortColumn === 'youtubeID' ? sortDirection : null}
                onClick={() => sort('youtubeID')}
              >
                YoutubeID
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
            {map(videos, ({ id, title, youtubeID, inserted_at }) => (
              <Table.Row key={id}>
                <Table.Cell>{title}</Table.Cell>
                <Table.Cell>{youtubeID}</Table.Cell>
                <Table.Cell>{inserted_at}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    )

    // return (
    //   <Container fluid>
    //     <Table
    //       filter={filter}
    //       redirect={history.push}
    //       selection={selection}
    //       updateState={updateState}
    //       {...selectParams}
    //     />

    //     <Navbar
    //       color="dark"
    //       dark
    //       fixed="bottom"
    //       expand="sm"
    //       className="d-flex justify-content-around"
    //     >
    //       {isAuthentificated && (
    //         <Nav navbar className="mr-auto">
    //           <NavItem>
    //             <ButtonGroup>
    //               <Button
    //                 color="light"
    //                 onClick={() => updateVideos(selection, { locked: false })}
    //               >
    //                 <Icon fa unlock-alt />
    //               </Button>
    //               <Button
    //                 color="light"
    //                onClick={() => updateVideos(selection, { locked: true })}
    //               >
    //                 <Icon fa lock />
    //               </Button>
    //               <Button
    //                 color="light"
    //                 onClick={() => deleteVideos(selection)}
    //               >
    //                 <Icon fa trash-alt className="text-danger" />
    //               </Button>
    //             </ButtonGroup>
    //           </NavItem>
    //         </Nav>
    //       )}
    //       <Nav navbar>
    //         <NavItem>
    //           <Input
    //             name="search"
    //             onChange={this.filter}
    //             placeholder="Search..."
    //             type="search"
    //             value={filter}
    //           />
    //         </NavItem>
    //       </Nav>
    //     </Navbar>
    //   </Container>
    // );
  }
}
const mapStateToProps = store => ({
  isAuthentificated: !!store.session.currentUser,
  loading: videoSelectors.loading(store),
  sortColumn: videoSelectors.sortColumn(store),
  sortDirection: videoSelectors.sortDirection(store),
  videos: videoSelectors.videos(store)
});

const mapDispatchToProps = {
  sort: Video.sort,
  deleteVideos: Video._deleteAll,
  updateVideos: Video.updateAll
}

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);
