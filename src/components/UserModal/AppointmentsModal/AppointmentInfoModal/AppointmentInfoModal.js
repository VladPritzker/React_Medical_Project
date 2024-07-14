// src/components/AppointmentInfoModal.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import './AppointmentInfoModal.css';

const AppointmentInfoModal = ({ appointment, onClose, onDeleteClick, onCheckboxChange }) => {
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateTime.toLocaleString('en-US', options);
  };

  return (
    <div className="appointment-info-modal-overlay">
      <div className="appointment-info-modal-content">
        <FontAwesomeIcon
          icon={faTimes}
          className="close-icon"
          onClick={onClose}
        />
        <h2>Appointment Details</h2>
        <p><strong>Date & Time:</strong> {formatDateTime(appointment.appointment_date)}</p>
        <p><strong>Doctor:</strong> {appointment.doctor}</p>
        <p><strong>Notes:</strong> {appointment.notes}</p>
        <div className="appointment-actions">
          <label>
            Done:
            <input
              type="checkbox"
              checked={appointment.done}
              onChange={(e) => onCheckboxChange(appointment.id, e.target.checked)}
            />
          </label>
          <FontAwesomeIcon
            icon={faTrash}
            className="delete-appointment-icon"
            onClick={onDeleteClick}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentInfoModal;
