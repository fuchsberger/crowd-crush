import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Dropdown, Input, Icon, Menu } from 'semantic-ui-react'
import { sessionOperations as Session } from '../modules/session'

class Header extends React.Component {

  render() {
    const { history, signOut, user } = this.props;
    const path = history.location.pathname;

    return (
      <Menu fixed='top' inverted>
        <Menu.Item header>Crowd Crush</Menu.Item>

        <Menu.Item as={Link} active={path === '/about'} to='/about'>
          <Icon name='info' />
          About
        </Menu.Item>

        <Menu.Item as={Link} active={path === '/videos'} to='/videos'>
          <Icon name='video camera' />
          Videos
        </Menu.Item>

        {/* {session && navItem(path, '/video/add', 'Add Video', 'plus')} */}
        {/* {admin && navItem(path, '/users', 'Users', 'users')} */}

        <Menu.Menu position='right'>

          <Menu.Item>
            <Input icon='search' disabled placeholder='Search...' />
          </Menu.Item>

          {!user &&
            <Menu.Item as={Link} to='/sign_in'>
              <Icon name='power' />
              Sign In
            </Menu.Item>
          }

          {user &&
            <Dropdown item text={user.first_name}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/settings">
                  <Icon name='cog' />
                  Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={() => signOut(history.push)}>
                  <Icon name='power' />
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          }
        </Menu.Menu>

        {/* {session === null && (
          <NavItem>
            <NavLink>
              <Icon fa spinner spin />
            </NavLink>
          </NavItem>
        )} */}

        {/* {session && (
          <NavItem className="d-none d-md-block">
            <span className="navbar-text">{session.name}</span>
          </NavItem>
        )} */}
        {/* {session && (
          <NavItem id="btnSettings">
            <NavLink
              tag={Link}
              active={path === '/settings'}
              to={'/settings'}
            >
              <Icon fa cog className="mr-1" />
              <span className="d-md-none">Settings</span>
            </NavLink>
          </NavItem>
        )} */}
      </Menu>
    );
  }
}

const mapStateToProps = store => ({ user: store.session.user });
const mapDispatchToProps = { signOut: Session.signOut }
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
