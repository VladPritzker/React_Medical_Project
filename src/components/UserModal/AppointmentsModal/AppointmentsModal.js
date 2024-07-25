import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import './AppointmentsModal.css';
import AddAppointmentModal from './AddAppointmentModal/AddAppointmentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal/DeleteConfirmationModal';
import AppointmentInfoModal from './AppointmentInfoModal/AppointmentInfoModal';

const StyledCalendar = styled(Calendar)`
  border: none;
  width: 600px;
  .react-calendar {
  width: 600px}
  .react-calendar__tile {
    border-radius: 8px;
    transition: background-color 0.3s, color 0.3s;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e0e0e0;
  }
  .react-calendar__tile--now {
    background: #4caf50;
    color: white;
  }
  .react-calendar__tile--active {
    background: #3f51b5;
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #303f9f;
    color: white;
  }
  .react-calendar__tile--hasActive {
    background: #f44336;
    color: white;
  }
  .react-calendar__tile.react-calendar__month-view__days__day {
    background-color: white;
    color: black;
  }
  .appointment-icon {
    color: #0060b9;
    width: 20px;
  }

  
`;

const AppointmentsModal = ({ userId, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterNotes, setFilterNotes] = useState('');
  const [filterDone, setFilterDone] = useState('not_done'); // Default to 'not_done'

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

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    fetchAppointments();
  }, [appointments]);

  const handleAddAppointment = (newAppointment) => {
    const formattedDate = new Date(newAppointment.appointment_date);
    if (!isNaN(formattedDate)) {
      setAppointments((prevAppointments) => [
        ...prevAppointments,
        {
          ...newAppointment,
          appointment_date: formattedDate.toISOString(), // Ensure the format matches
        },
      ]);
    } else {
      console.error('Invalid appointment date:', newAppointment.appointment_date);
    }
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

  const handleDeleteAppointment = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteConfirmationModal(true);
  };

  const confirmDeleteAppointment = async () => {
    try {
      const response = await fetch(`http://localhost:8001/appointments/${userId}/${appointmentToDelete}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== appointmentToDelete)
        );
        setShowDeleteConfirmationModal(false);
      } else {
        console.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateTime.toLocaleString('en-US', options);
  };

  // Filtered appointments based on the filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchDate = filterDate ? appointment.appointment_date.startsWith(filterDate) : true;
    const matchDoctor = filterDoctor ? appointment.doctor.toLowerCase().includes(filterDoctor.toLowerCase()) : true;
    const matchNotes = filterNotes ? appointment.notes.toLowerCase().includes(filterNotes.toLowerCase()) : true;
    const matchDone =
      filterDone === 'all' ? true : filterDone === 'done' ? appointment.done : !appointment.done;

    return matchDate && matchDoctor && matchNotes && matchDone;
  });

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const appointment = appointments.find(app => app.appointment_date.startsWith(dateString));
      return appointment ? <FontAwesomeIcon icon={faPlus} className="appointment-icon" /> : null;
    }
    return null;
  };

  const onDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const appointment = appointments.find(app => app.appointment_date.startsWith(dateString));
    if (appointment) {
      setSelectedAppointment(appointment);
    }
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

        <div className="filters">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Filter by Date"
          />
          <input
            type="text"
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            placeholder="Filter by Doctor"
          />
          <input
            type="text"
            value={filterNotes}
            onChange={(e) => setFilterNotes(e.target.value)}
            placeholder="Filter by Notes"
          />
          <select value={filterDone} onChange={(e) => setFilterDone(e.target.value)}>
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="not_done">Not Done</option>
          </select>
        </div>

        {filteredAppointments.length > 0 ? (
          <ul className="appointments-list">
            {filteredAppointments.map((appointment, index) => (
              <li key={appointment.id} className="appointments-list-item">
                <div className="appointment-details">
                  <p><strong>Date & Time:</strong> {formatDateTime(appointment.appointment_date)}</p>
                  <p className='right1'><strong>Doctor:</strong> {appointment.doctor}</p>
                  <p className='right2'><strong>Notes:</strong> {appointment.notes}</p>
                </div>
                <div className="appointment-actions">
                  <label>
                    Done:
                    <input
                      type="checkbox"
                      checked={appointment.done}
                      onChange={(e) => handleCheckboxChange(appointment.id, e.target.checked)}
                    />
                  </label>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-appointment-icon"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}

        <StyledCalendar
          tileContent={tileContent}
          onClickDay={onDateClick}
        />
      </div>
      {showAddAppointmentModal && (
        <AddAppointmentModal
          userId={userId}
          onClose={() => setShowAddAppointmentModal(false)}
          onAdd={handleAddAppointment}
        />
      )}
      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDeleteAppointment}
          onCancel={() => setShowDeleteConfirmationModal(false)}
        />
      )}
      {selectedAppointment && (
        <AppointmentInfoModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(false)}
          onDeleteClick={() => handleDeleteAppointment(selectedAppointment.id)}
          onCheckboxChange={handleCheckboxChange}
        />
      )}
    </div>
  );
};

export default AppointmentsModal;
