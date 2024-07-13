import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import './AppointmentsModal.css';
import AddAppointmentModal from './AddAppointmentModal/AddAppointmentModal';

const AppointmentsModal = ({ userId, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8001/appointments/${userId}/`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleAddAppointment = (newAppointment) => {
    setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
  };

  const handleCheckboxChange = async (appointmentId, done) => {
    try {
      const response = await fetch(`http://localhost:8001/appointments/${userId}/${appointmentId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done }),
      });

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, done } : appointment
          )
        );
      } else {
        console.error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateTime.toLocaleString('en-US', options);
  };

  return (
    <div className="appointments-modal-overlay">
      <div className="appointments-modal-content">
        <FontAwesomeIcon
          icon={faTimes}
          className="appointments-close-icon"
          onClick={onClose}
        />
        <h2>Appointments</h2>
        <button
          className="add-appointment-button"
          onClick={() => setShowAddAppointmentModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Appointment
        </button>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment, index) => (
              <li key={appointment.id} className="appointments-list-item">
                <p><strong>Date & Time:</strong> {formatDateTime(appointment.appointment_date)}</p>
                <p><strong>Doctor:</strong> {appointment.doctor}</p>
                <p><strong>Notes:</strong> {appointment.notes}</p>
                <label>
                  Done:
                  <input
                    type="checkbox"
                    checked={appointment.done}
                    onChange={(e) => handleCheckboxChange(appointment.id, e.target.checked)}
                  />
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
      {showAddAppointmentModal && (
        <AddAppointmentModal
          userId={userId}
          onClose={() => setShowAddAppointmentModal(false)}
          onAdd={handleAddAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentsModal;
