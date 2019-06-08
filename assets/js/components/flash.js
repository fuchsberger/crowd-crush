import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Message } from 'semantic-ui-react'
import { flashOperations as Flash } from '../modules/flash'

class FlashContainer extends Component {

  // path has changed --> disable flash message, unless redirected from /
  componentWillReceiveProps(nProps) {
    const { location, flash, clearFlash } = this.props;
    if (!flash.dismissed
        && location.pathname !== nProps.location.pathname
        && location.path !== '/')
      clearFlash();
  }

  render() {
    const { clearFlash, flash } = this.props
    const { dismissed, header, content, ...typeProps } = flash

    if(dismissed) return null;

    return (
      <Container>
        <Message
          compact
          size='small'
          icon='check circle'
          header={header}
          content={content}
          onDismiss={clearFlash}
          {...typeProps}
        />
      </Container>
    );
  }
}
const mapStateToProps = ({ flash }) => ({ flash });
const mapDispatchToProps = { clearFlash: Flash.clear }
export default withRouter(connect( mapStateToProps, mapDispatchToProps )(FlashContainer));
