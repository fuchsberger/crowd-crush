import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import TinyMCE from 'react-tinymce';
import sanitizeHtml from 'sanitize-html-react';
import { MCE_DEFAULT_CONFIG } from '../../ducks/constants';
import { clearModal } from '../../modules/modal';
import { updateVideo } from '../../modules/simulation';

class SimulationView extends React.Component {
  constructor(props) {
    super(props);

    this.changeDesc = this.changeDesc.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);

    this.state = {
      description: props.desciption,
      error: null
    };
  }

  changeDesc(e) {
    this.setState({
      description: e.target.getContent(),
      errors: { ...this.state.errors, description: null }
    });
  }

  handleValidSubmit(e, values) {
    const { clearModal, updateVideo } = this.props;
    updateVideo(values);
    clearModal();
  }

  handleInvalidSubmit(e, errors, values) {
    this.setState({ error: true });
  }

  render() {
    const { title, modal, mode, clearModal } = this.props;
    const { error, description } = this.state;
    const { changeDesc, handleValidSubmit, handleInvalidSubmit } = this;

    return (
      <AvForm
        className={error ? 'was-validated' : 'needs-validation'}
        onValidSubmit={handleValidSubmit}
        onInvalidSubmit={handleInvalidSubmit}
      >
        <Modal
          backdrop={mode ? 'static' : true}
          isOpen={modal === 'video'}
          toggle={() => clearModal()}
          size="lg"
        >
          <ModalHeader toggle={() => clearModal()}>
            {mode ? 'Video Details' : title}
          </ModalHeader>
          {mode ? (
            <ModalBody>
              <AvField
                className="w-100"
                bsSize="lg"
                id="title"
                name="title"
                placeholder="Title"
                validate={{
                  required: {
                    value: true,
                    errorMessage: 'Required Field.'
                  },
                  minLength: {
                    value: 5,
                    errorMessage: 'Minimum 6 characters'
                  },
                  maxLength: {
                    value: 100,
                    errorMessage: 'Maximum 100 characters'
                  }
                }}
                value={title}
              />

              <TinyMCE
                config={MCE_DEFAULT_CONFIG}
                content={description}
                onChange={changeDesc}
              />
            </ModalBody>
          ) : (
            <ModalBody
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          )}
          {mode && (
            <ModalFooter className="text-center">
              <Button className="mr-2" onClick={() => clearModal()}>
                Cancel
              </Button>
              <Button color="primary">Save</Button>
            </ModalFooter>
          )}
        </Modal>
      </AvForm>
    );
  }
}

const mapStateToProps = store => ({
  desciption: store.simulation.video ? store.simulation.video.description : '',
  modal: store.simulation.modal,
  mode: store.simulation.mode,
  title: store.simulation.video ? store.simulation.video.title : null
});

const mapDispatchToProps = {
  clearModal,
  updateVideo
}

export default connect(mapStateToProps, mapDispatchToProps)(SimulationView);
