import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export function BugTable() {
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

  const handleSubmit = () => {
    handleCloseModal();
  };
  return <></>;
}
