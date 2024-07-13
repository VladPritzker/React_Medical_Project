import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './AddAppointmentModal.css';

const AddAppointmentModal = ({ userId, onClose, onAdd }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddAppointment = async () => {
    if (!date || !time || !doctor || !notes) {
      alert('Please fill out all fields');
      return;
    }

    const newAppointment = {
      appointment_date: `${date}T${time}`,
      doctor,
      notes,
    };

    try {
      const response = await fetch(`http://localhost:8001/appointments/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        const data = await response.json();
        onAdd(data);
        onClose();
      } else {
        alert('Failed to add appointment');
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert('Error adding appointment');
    }
  };

  return (
    <div className="add-appointment-modal-overlay">
      <div className="add-appointment-modal-content">
        <FontAwesomeIcon
          icon={faTimes}
          className="add-appointment-close-icon"
          onClick={onClose}
        />
        <h2>Add Appointment</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
          className="add-appointment-input"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time"
          className="add-appointment-input"
        />
        <input
          type="text"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          placeholder="Doctor"
          className="add-appointment-input"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="add-appointment-textarea"
        />
        <button
          className="add-appointment-button"
          onClick={handleAddAppointment}
        >
          Add Appointment
        </button>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
