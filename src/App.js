import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import UserModal from './components/UserModal/UserModal';
import Appointments from './components/Appointments/Appointments';
import UserHistory from './components/UserHistory/UserHistory';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function UserPage() {
  const { userId } = useParams();
  const [isAppointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [isUserHistoryModalOpen, setUserHistoryModalOpen] = useState(false);

  const openAppointmentsModal = () => setAppointmentsModalOpen(true);
  const closeAppointmentsModal = () => setAppointmentsModalOpen(false);

  const openUserHistoryModal = () => setUserHistoryModalOpen(true);
  const closeUserHistoryModal = () => setUserHistoryModalOpen(false);

  return (
    <div className="user-page">
      <div className="user-container">
        <UserModal userId={userId} />
        <div className="buttons-container">
          <button onClick={openAppointmentsModal}>Appointments</button>
          <button onClick={openUserHistoryModal}>User History</button>
        </div>
      </div>

      {isAppointmentsModalOpen && (
        <div className="modal-overlay">
          <div className="appointments-modal">
            <button className="modal-close" onClick={closeAppointmentsModal}>
              <i className="fas fa-times"></i>
            </button>
            <Appointments userId={userId} />
          </div>
        </div>
      )}

      {isUserHistoryModalOpen && (
        <div className="modal-overlay">
          <div className="userhistory-modal">
            <button className="modal-close" onClick={closeUserHistoryModal}>
              <i className="fas fa-times"></i>
            </button>
            <UserHistory userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
