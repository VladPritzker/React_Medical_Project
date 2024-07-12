import React, { useState } from 'react';
import Modal from 'react-modal';
import './AddAppointmentModal.css';

Modal.setAppElement('#root');

function AddAppointmentModal({ userId, isOpen, onClose, onSave }) {
  const [newAppointment, setNewAppointment] = useState({
    doctor: '',
    appointment_date: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8001/appointments/${userId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAppointment),
    })
      .then(response => response.json())
      .then(data => {
        onSave(data);
        onClose();
        setNewAppointment({
          doctor: '',
          appointment_date: '',
          notes: ''
        });
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="addAppointment-modal"
      overlayClassName="addAppointment-modal-overlay"
    >
      <h2>Add New Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Doctor:
          <input
            type="text"
            name="doctor"
            value={newAppointment.doctor}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Appointment Date:
          <input
            type="date"
            name="addAppointment_date"
            value={newAppointment.appointment_date}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Notes:
          <textarea
            name="notes"
            value={newAppointment.notes}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
}

export default AddAppointmentModal;
