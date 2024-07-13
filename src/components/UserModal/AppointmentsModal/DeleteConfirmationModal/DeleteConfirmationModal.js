import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-confirmation-modal-overlay">
      <div className="delete-confirmation-modal-content">
        <FontAwesomeIcon
          icon={faTimes}
          className="delete-confirmation-close-icon"
          onClick={onCancel}
        />
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this appointment?</p>
        <button className="delete-confirmation-button" onClick={onConfirm}>
          Confirm
        </button>
        <button className="delete-confirmation-cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
