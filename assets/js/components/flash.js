import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import { flashOperations as Flash } from '../modules/flash'
import Icon from './icon'

class FlashContainer extends React.Component {
  // path has changed --> disable flash message, unless redirected from /
  componentWillReceiveProps(nProps) {
    const { location, flash, clearFlash } = this.props;
    if (flash && location.pathname !== nProps.location.pathname
        && location.path !== '/') clearFlash();
  }

  render() {
    const { flash, clearFlash } = this.props;
    const show = flash ? 'show-flash' : '';

    if(!flash) return null;

    return (
      <Alert
        className={`alert-flash d-flex justify-content-between ${show}`}
        color={flash.type == 'error' ? 'danger' : 'info'}
        onClick={() => clearFlash()}
      >
        <span>
          { flash.type == 'error' ? <Icon fa exclamation-circle /> : <Icon fa info-circle /> }
        </span>
        <span>{flash.msg}</span>
        <button type="button" className="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </Alert>
    );
  }
}
const mapStateToProps = ({ flash }) => ({ flash });
const mapDispatchToProps = { clearFlash: Flash.clear }
export default withRouter(connect( mapStateToProps, mapDispatchToProps )(FlashContainer));
