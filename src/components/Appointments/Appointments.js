import React, { useEffect, useState } from 'react';
import './Appointments.css';

function Appointments({ userId }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8001/appointments/${userId}/`)
      .then(response => response.json())
      .then(data => setAppointments(data));
  }, [userId]);

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            {appointment.doctor} - {appointment.appointment_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
