import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { updateUsers } from '../../modules/userList';
import { clearModal } from '../../modules/modal';

const ModalBlock = ({ modal, clearModal, updateUsers }) => (
  <Modal backdrop="static" isOpen={modal.modal === 'block' } toggle={() => clearModal()}>
    <ModalHeader>
      Reason for Blocking
      <button
        className="close"
        style={{ position: 'absolute', top: '15px', right: '15px' }}
        onClick={() => clearModal()}
      >
        &times;
      </button>
    </ModalHeader>
    <ModalBody>
      <AvForm
        onValidSubmit={(e, values) => {
          const user_ids = modal.user_id ? [modal.user_id] : modal.user_ids
          updateUsers(user_ids, {blocked_msg: values.reason});
          clearModal();
        }}
      >
        <p>You can optionally provide a reason for blocking:</p>
        <AvField
          id="reason"
          name="reason"
          type="textarea"
          validate={{
            maxLength: {
              value: 300,
              errorText: 'A maximum of 300 characters allowed for reason'
            }
          }}
        />
        <Button className="mr-2" color="danger" type="submit">
          Block
        </Button>
        <Button color="secondary" onClick={() => clearModal()}>
          Cancel
        </Button>
      </AvForm>
    </ModalBody>
  </Modal>
);

const mapStateToProps = store => ({ modal: store.modal })

const mapDispatchToProps = {
  clearModal,
  updateUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalBlock);