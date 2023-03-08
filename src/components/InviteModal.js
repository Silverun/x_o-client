import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const InviteModal = () => {
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Modal.Body>
          <p>You have been invited to a game</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default InviteModal;
