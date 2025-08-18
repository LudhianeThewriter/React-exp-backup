import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export function BugTable({ bugList }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [actionType, setActionType] = useState("");
  const [message, setMessage] = useState("");

  const handleOpenModal = (bug, type) => {
    setSelectedBug(bug);
    setActionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMessage("");
  };

  const handleSubmit = async () => {
    console.log("Action ", actionType);
    console.log("Bug ", selectedBug);
    console.log("message ", message);
    if (!selectedBug?.id) return;
    try {
      const bugRef = doc(db, "bugLogs", selectedBug.id);

      await updateDoc(bugRef, {
        status: actionType,
        resolvedDate: new Date().toISOString().split("T")[0],
        resolvedmsg: message,
      });
      toast.success(`Bug has been Reported as ${actionType}`);
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to Submit");
    }
  };
  return (
    <>
      <div className="table-responsive mt-4">
        <table className="table table-striped table-dark  table-bordered table-hover">
          <thead>
            <tr className="text-center">
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Reported date</th>
              <th>Resolved Date</th>
              <th>Resolved Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bugList.map((bug, index) => (
              <tr
                key={index}
                className={
                  bug.status === "Resolve"
                    ? "table-success"
                    : bug.status === "Not a Problem"
                    ? "table-danger"
                    : bug.status === "Progress"
                    ? "table-warning"
                    : ""
                }
              >
                <td>{bug.email}</td>
                <td>{bug.message}</td>
                <td>{bug.status}</td>
                <td>{bug.date}</td>
                <td>{bug.resolvedDate}</td>
                <td>{bug.resolvedmsg}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleOpenModal(bug, "Resolve")}
                  >
                    Resolve
                  </button>
                  <button className="btn btn-outline-warning btn-sm">
                    Progress
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleOpenModal(bug, "Not a Problem")}
                  >
                    Not a Problem ?
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {actionType} Bug – {selectedBug?.email}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
