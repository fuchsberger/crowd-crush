import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Container, Icon, Menu } from 'semantic-ui-react'

const Footer = ({ location }) => {

  // do not show at certain pages (because they have a replacement footer)
  if(['/login', '/simulations', '/videos'].includes(location.pathname) ||
    location.pathname.startsWith('/videos/') ||
    location.pathname.startsWith('/simulation/')
  ) return null;

  return(
    <Menu text compact>
                {/* <List bulleted celled horizontal link>
        <List.Item>About Us</List.Item>
        <List.Item>Contact</List.Item>
        <List.Item>Support</List.Item>
      </List>
      <Menu.Item>

      </Menu.Item> */}

        <Menu.Item as={Link} to='https://github.com/Sathras/crowd-crush' target='_blank'>
          <Icon name="github" />
          Available on Github
        </Menu.Item>
        <Menu.Item><Icon name='copyright outline' /> 2019 Alexander Fuchsberger</Menu.Item>
        <Menu.Item>created with <Icon name='heart' /></Menu.Item>
    </Menu>
  );
};

export default withRouter(Footer);
