import React, { useEffect, useState } from 'react';
import './Appointments.css';
import AddAppointmentModal from './AddAppointmentModal/AddAppointmentModal';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

function Appointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8001/appointments/${userId}/`)
      .then(response => response.json())
      .then(data => setAppointments(data));
  }, [userId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveNewAppointment = (newAppointment) => {
    setAppointments([...appointments, newAppointment]);
    handleCloseModal();
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8001/appointments/${userId}/${appointmentId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      } else {
        console.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      <button onClick={handleOpenModal} className="add-appointment-button">Add New Appointment</button>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            {appointment.doctor} - {appointment.appointment_date} - {appointment.notes}
            <button onClick={() => handleDeleteAppointment(appointment.id)} className="delete-appointment-button">
              Delete
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="appointment-modal-overlay">
          <div className="appointment-modal">
            <i className="fas fa-times modal-close" onClick={handleCloseModal}></i>
            <AddAppointmentModal
              userId={userId}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveNewAppointment}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
