import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Collapse,
  Container,
  Input,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler
} from 'reactstrap';

import Icon from '../../utils/icons';
import { updateUsers, deleteUsers } from '../../modules/userList';
import { error } from '../../modules/flash';
import { showModal } from '../../modules/modal';
import ErrorView from '../home/error';
import ModalBlock from '../../components/user/modal_block';
import UserTable from '../../components/user/table';
import { isAdmin } from '../../ducks/selectors';

class UsersView extends React.Component {
  constructor(props) {
    super(props);

    this.deleteUsers = this.deleteUsers.bind(this);
    this.demoteUsers  = this.demoteUsers.bind(this);
    this.promoteUsers = this.promoteUsers.bind(this);
    this.unblockUsers = this.unblockUsers.bind(this);
    this.search = this.search.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.updateState = this.updateState.bind(this);

    this.state = {
      blockedUser: null,
      collapsed: true,
      filtered: [],
      filterAll: '',
      selection: [],
      selectAll: false
    };
  }

  deleteUsers(){
    const user_ids = this.state.selection
    var r = confirm(`Are you sure you want to delete ${user_ids.length} users?`)
    if(r) this.props.deleteUsers(user_ids)
  }

  demoteUsers(){
    this.props.updateUsers(this.state.selection, { admin: false })
  }

  promoteUsers(){
    this.props.updateUsers(this.state.selection, { admin: true })
  }

  unblockUsers(){
    this.props.updateUsers(this.state.selection, { blocked_msg: null })
  }

  search(e) {
    // NOTE: this completely clears any COLUMN filters
    this.setState({
      filterAll: e.target.value,
      filtered: [{ id: 'all', value: e.target.value }]
    });
  }

  toggleNav() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  updateState(nState) {
    this.setState({ ...this.state, ...nState });
  }

  render() {
    const { admin, ready, showModal } = this.props;
    if (admin === false) return <ErrorView code={403} />;
    if (!admin || !ready) return <Loading />;

    const {
      blockedUser,
      collapsed,
      filter,
      selection,
      ...selectParams
    } = this.state;

    const { deleteUsers, demoteUsers, promoteUsers, unblockUsers,
    search, toggleNav, updateState } = this;

    return (
      <Container fluid>
        <UserTable
          filter={filter}
          selection={selection}
          updateState={updateState}
          {...selectParams}
        />

        <Navbar color="dark" dark fixed="bottom" expand="sm">
          <NavbarToggler onClick={toggleNav} className="mr-2" />
          <Collapse isOpen={!collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <ButtonGroup>
                  <Button color="light" onClick={demoteUsers}>
                    <Icon fas user />
                  </Button>
                  <Button color="light" onClick={promoteUsers}>
                    <Icon fas user-plus className="text-primary" />
                  </Button>
                </ButtonGroup>
              </NavItem>
              <NavItem className="ml-2">
                <ButtonGroup>
                  <Button color="light" onClick={unblockUsers} >
                    <Icon fas unlock-alt />
                  </Button>
                  <Button color="light">
                    <Icon fas lock className="text-danger"
                      onClick={() => showModal('block', {user_ids: selection})} />
                  </Button>
                </ButtonGroup>
              </NavItem>
              <NavItem className="ml-2">
                <Button color="light" onClick={deleteUsers}>
                  <Icon fas trash-alt className="text-danger" />
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
          <Collapse isOpen={!collapsed} navbar>
            <Nav navbar>
              <NavItem className="ml-2">
                <Input
                  name="search"
                  onChange={search}
                  placeholder="Search..."
                  type="search"
                  value={filter}
                />
              </NavItem>
            </Nav>
          </Collapse>
          <Nav navbar>
            <NavItem className="ml-2">
              <NavLink color="light" onClick={() => showModal('register')}>
                <Icon fas user-plus /> Register
              </NavLink>
            </NavItem>
            <NavItem className="ml-2 d-none">
              <NavLink
                color="light"
                disabled
                tag={Link}
                to="/admin/invitations"
              >
                <Icon far user /> Invitations
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>

        <ModalBlock selection={blockedUser ? [blockedUser] : selection} />
      </Container>
    );
  }
}

const mapStateToProps = store => ({
  admin: isAdmin(store),
  ready: !!store.userList
})

const mapDispatchToProps = {
  error,
  updateUsers,
  deleteUsers,
  showModal
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
