import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sortBy, map } from 'lodash/collection'
import { Container, Table } from 'semantic-ui-react'
// import {
//   Button,
//   ButtonGroup,
//   Container,
//   Input,
//   Navbar,
//   Nav,
//   NavItem
// } from 'reactstrap'
// import { Icon, Loading } from '../components'
import { videoOperations as Video } from '../modules/video'
// import { Table } from './video'

const tableData = [
  { name: 'John', age: 15, gender: 'Male' },
  { name: 'Amber', age: 40, gender: 'Female' },
  { name: 'Leslie', age: 25, gender: 'Other' },
  { name: 'Ben', age: 70, gender: 'Male' },
]

class VideosList extends Component {

  state = {
    column: null,
    data: tableData,
    direction: null,
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  // constructor(props) {
  //   super(props);

  //   // bindings
  //   this.filter = this.filter.bind(this);
  //   this.deleteVideos = this.deleteVideos.bind(this);
  //   this.updateState = this.updateState.bind(this);

  //   this.state = {
  //     filtered: '',
  //     filterAll: false,
  //     selectAll: false,
  //     selection: []
  //   };
  // }

  // filter(e) {
  //   // NOTE: this completely clears any COLUMN filters
  //   this.setState({
  //     filterAll: e.target.value,
  //     filtered: [{ id: 'all', value: e.target.value }]
  //   });
  // }

  // deleteVideos(){
  //   const video_ids = this.state.selection
  //   var r = confirm(`Are you sure you want to delete ${video_ids.length} videos?`)
  //   if(r) this.props.deleteVideos(video_ids)
  // }

  // updateState(nState) {
  //   this.setState({ ...this.state, ...nState });
  // }

  render() {

    const { column, data, direction } = this.state

    // const { isAuthentificated, history, ready, updateVideos } = this.props;

    // if(!ready) return <Loading />

    // const { deleteVideos, updateState } = this;
    // const { filter, selection, ...selectParams } = this.state;

    return (
      <Container padded>
        <Table compact sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={this.handleSort('name')}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'age' ? direction : null}
                onClick={this.handleSort('age')}
              >
                Age
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'gender' ? direction : null}
                onClick={this.handleSort('gender')}
              >
                Gender
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {map(data, ({ age, gender, name }) => (
              <Table.Row key={name}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{age}</Table.Cell>
                <Table.Cell>{gender}</Table.Cell>
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
  ready: !!store.videos
});

const mapDispatchToProps = {
  deleteVideos: Video._deleteAll,
  updateVideos: Video.updateAll
}

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);
