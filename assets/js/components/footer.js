import { withRouter } from 'react-router-dom'
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'
import Icon from './icon'

const Footer = ({ location }) => {

  // do not show at certain pages (because they have a replacement footer)
  if(['/simulations', '/videos'].includes(location.pathname) ||
    location.pathname.startsWith('/videos/') ||
    location.pathname.startsWith('/simulation/')
  ) return null;

  return(
    <Navbar color="dark" dark fixed="bottom">
      <Nav navbar className="d-none d-md-block d-lg-block d-xl-block">
        <NavItem>
          <NavLink href="https://github.com/Sathras/crowd-crush" target="_blank">
            <Icon fab github className="mr-1" />
            Available on Github
          </NavLink>
        </NavItem>
      </Nav>
      <span className="navbar-text text-nowrap">
        <Icon far copyright /> 2017-2018 Alexander Fuchsberger
      </span>
      <span className="navbar-text d-none d-lg-block d-xl-block">
        created with <Icon far heart />
      </span>
    </Navbar>
  );
};

export default withRouter(Footer);
