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
      className="add-appointment-modal"
      overlayClassName="add-appointment-modal-overlay"
    >
      <div className="add-appointment-modal-header">
        <h2>Add New Appointment</h2>
        <i className="fas fa-times add-appointment-modal-close" onClick={onClose}></i>
      </div>
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
            name="appointment_date"
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
        <div className="add-appointment-modal-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

export default AddAppointmentModal;
