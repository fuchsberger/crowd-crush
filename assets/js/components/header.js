import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Dropdown, Icon, Menu } from 'semantic-ui-react'
import { sessionOperations as Session } from '../modules/session'

const Header = ({ location, history, signOut, user }) => (
  <Menu fixed='top' inverted>
    <Menu.Item header>Crowd Crush</Menu.Item>

    <Menu.Item as={Link} active={location.pathname === '/about'} to='/about'>
      <Icon name='info' />
      About
    </Menu.Item>

    <Menu.Item as={Link} active={location.pathname === '/videos'} to='/videos'>
      <Icon name='video camera' />
      Videos
    </Menu.Item>

    {/* {session && navItem(path, '/video/add', 'Add Video', 'plus')} */}
    {/* {admin && navItem(path, '/users', 'Users', 'users')} */}

    <Menu.Menu position='right'>

      {/* <Menu.Item>
        <Input icon='search' disabled placeholder='Search...' />
      </Menu.Item> */}

      {!user && location.pathname != '/login' &&
        <Menu.Item as={Link} to='/login'>
          <Icon name='power' />
          Login
        </Menu.Item>
      }

      {user &&
        <Dropdown item icon='caret down' text={user.username}>
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
  </Menu>
);

const mapStateToProps = store => ({ user: store.session.user });
const mapDispatchToProps = { signOut: Session.signOut }
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
