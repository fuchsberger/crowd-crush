import { connect } from 'react-redux'
import {
  Button,
  ButtonGroup,
  Container,
  Input,
  Navbar,
  Nav,
  NavItem
} from 'reactstrap'
import { Icon, Loading } from '../components'
import { videoOperations as Video } from '../modules/video'
import { Table } from './video'

class VideosList extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.filter = this.filter.bind(this);
    this.deleteVideos = this.deleteVideos.bind(this);
    this.updateState = this.updateState.bind(this);

    this.state = {
      filtered: '',
      filterAll: false,
      selectAll: false,
      selection: []
    };
  }

  filter(e) {
    // NOTE: this completely clears any COLUMN filters
    this.setState({
      filterAll: e.target.value,
      filtered: [{ id: 'all', value: e.target.value }]
    });
  }

  deleteVideos(){
    const video_ids = this.state.selection
    var r = confirm(`Are you sure you want to delete ${video_ids.length} videos?`)
    if(r) this.props.deleteVideos(video_ids)
  }

  updateState(nState) {
    this.setState({ ...this.state, ...nState });
  }

  render() {

    const { isAuthentificated, history, ready, updateVideos } = this.props;

    if(!ready) return <Loading />

    const { deleteVideos, updateState } = this;
    const { filter, selection, ...selectParams } = this.state;

    return (
      <Container fluid>
        <Table
          filter={filter}
          redirect={history.push}
          selection={selection}
          updateState={updateState}
          {...selectParams}
        />

        <Navbar
          color="dark"
          dark
          fixed="bottom"
          expand="sm"
          className="d-flex justify-content-around"
        >
          {isAuthentificated && (
            <Nav navbar className="mr-auto">
              <NavItem>
                <ButtonGroup>
                  <Button
                    color="light"
                    onClick={() => updateVideos(selection, { locked: false })}
                  >
                    <Icon fa unlock-alt />
                  </Button>
                  <Button
                    color="light"
                   onClick={() => updateVideos(selection, { locked: true })}
                  >
                    <Icon fa lock />
                  </Button>
                  <Button
                    color="light"
                    onClick={() => deleteVideos(selection)}
                  >
                    <Icon fa trash-alt className="text-danger" />
                  </Button>
                </ButtonGroup>
              </NavItem>
            </Nav>
          )}
          <Nav navbar>
            <NavItem>
              <Input
                name="search"
                onChange={this.filter}
                placeholder="Search..."
                type="search"
                value={filter}
              />
            </NavItem>
          </Nav>
        </Navbar>
      </Container>
    );
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
