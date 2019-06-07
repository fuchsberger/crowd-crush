import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Dropdown, Icon, Menu } from 'semantic-ui-react'
import { sessionOperations as Session } from '../modules/session'

const item = (to, text, icon) => (
  <Menu.Item as={Link} active={location.pathname === to} to={to}>
    <Icon name={icon} />
    {text}
  </Menu.Item>
)

const Header = ({ location, history, signOut, username }) => (
  <Menu fixed='top' inverted pointing>
    <Menu.Item header>Crowd Crush</Menu.Item>
    {item('/about', 'About', 'info')}
    {item('/videos', 'Videos', 'video camera')}
    {username && item('/video/add', 'Add Video', 'plus')}
    {username && item('/users', 'Users', 'users')}

    <Menu.Menu position='right'>

      {/* <Menu.Item>
        <Input icon='search' disabled placeholder='Search...' />
      </Menu.Item> */}
      {!username && location.pathname != '/login' && item('/login', 'Login', 'power')}

      {username &&
        <Dropdown item icon='caret down' text={username}>
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

const mapStateToProps = ({ session }) => ({ username: session.username });
const mapDispatchToProps = { signOut: Session.signOut }
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
