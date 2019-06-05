import { connect } from 'react-redux'
import { Icon } from '../../components'
import { Button, InputGroup, InputGroupAddon, InputGroupText, ListGroup,
  ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation'
import { YOUTUBE_URL_REGEX } from '../../config'
import { simOperations as Sim } from '../../modules/sim'

class ModalOverlays extends React.Component {
  constructor(props) {
    super(props);

    this.changeURL = this.changeURL.bind(this);
    this.delete_overlay = this.delete_overlay.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    this.reset = this.reset.bind(this);
    this.select_overlay = this.select_overlay.bind(this);

    this.state = {
      error: null,
      title: '',
      youtubeID: null
    };
  }

  changeURL(e) {
    // validate url
    const match = e.target.value.match(YOUTUBE_URL_REGEX);
    const id = match && match[5].length == 11 ? match[5] : false;
    this.setState({ youtubeID: id || false });
  }

  delete_overlay(e, youtubeID) {
    e.stopPropagation();
    this.props.deleteOverlay(youtubeID);
  }

  reset(e) {
    e.preventDefault();
    this.setState({
      error: null,
      title: '',
      youtubeID: null
    });
  }

  select_overlay(overlay) {
    this.setState(overlay);
  }

  handleValidSubmit(e, values) {
    this.props.addOverlay(values);
    this.reset(e);
  }

  handleInvalidSubmit(e, errors, values) {
    this.setState({ error: true });
  }

  render() {
    const { close, isOpen, overlays } = this.props;
    const { error, title, youtubeID } = this.state;
    const {
      changeURL,
      delete_overlay,
      handleValidSubmit,
      handleInvalidSubmit
    } = this;

    const overlay_list = overlays.map((o, i) => (
      <ListGroupItem action key={i} onClick={() => this.select_overlay(o)}>
        {o.title}
        <Icon fa times
          className="float-right pointer"
          onClick={e => delete_overlay(e, o.youtubeID)}
        />
      </ListGroupItem>
    ));

    return (
      <Modal
        isOpen={isOpen}
        onOpened={() => document.getElementById('youtube_url').focus()}
        toggle={() => close()}
      >
        <ModalHeader toggle={() => close()}>
          Manage Youtube Overlays
        </ModalHeader>
        {overlays.length > 0 && (
          <ModalBody>
            <ListGroup>{overlay_list}</ListGroup>
          </ModalBody>
        )}
        <ModalFooter className="bg-light">
          <AvForm
            className={error ? 'was-validated' : 'needs-validation'}
            onValidSubmit={handleValidSubmit}
            onInvalidSubmit={handleInvalidSubmit}
          >
            { youtubeID
              ? <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>{youtubeID}</InputGroupText>
                    <AvInput type="hidden" name="youtubeID" value={youtubeID} />
                  </InputGroupAddon>
                  <AvInput
                    className="text-center"
                    id="overlay_title"
                    name="title"
                    placeholder="Title"
                    value={title}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: 'Required Field.'
                      },
                      maxLength: {
                        value: 20,
                        errorMessage: 'A maximum of 20 characters is allowed'
                      }
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button color="primary" type="submit">Save</Button>
                  </InputGroupAddon>
                </InputGroup>
              : <AvField
                  className="text-center"
                  id="youtube_url"
                  name="youtube_url"
                  onChange={changeURL}
                  onSelect={e => e.target.select()}
                  placeholder="Youtube URL"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: 'Required Field.'
                    },
                    pattern: {
                      value: YOUTUBE_URL_REGEX,
                      errorMessage: 'Not a Youtube URL'
                    }
                  }}
                />
            }
          </AvForm>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = store => ({ overlays: store.sim.overlays })
const mapDispatchToProps = {
  addOverlay: Sim.addOverlay,
  deleteOverlay: Sim.deleteOverlay
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalOverlays)
