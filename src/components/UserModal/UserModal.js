import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Appointments from '../Appointments/Appointments';
import UserHistory from '../UserHistory/UserHistory';
import '../UserModal/UserModal.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

const UserPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isAppointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [isUserHistoryModalOpen, setUserHistoryModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8001/users/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          console.error('Error:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const response = await fetch(`http://localhost:8001/users/${userId}/avatar/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUserData((prevData) => ({ ...prevData, avatar: data.avatar }));
      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate('/registration');
  };

  const openAppointmentsModal = () => setAppointmentsModalOpen(true);
  const closeAppointmentsModal = () => setAppointmentsModalOpen(false);

  const openUserHistoryModal = () => setUserHistoryModalOpen(true);
  const closeUserHistoryModal = () => setUserHistoryModalOpen(false);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-card">
          <button onClick={handleLogout} className="logout-button">Logout</button>
          <div className="user-card-header">
            <h2>User Details</h2>
          </div>
          <div className="user-card-body">
            <img src={`http://localhost:8001${userData.avatar}`} alt="User Avatar" className="avatar" />
            <div className="user-info">
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <input type="file" onChange={handleAvatarChange} />
              <button onClick={handleAvatarUpload}>Upload Avatar</button>
            </div>
          </div>
        </div>
        <div className="buttons-container">
          <button onClick={openAppointmentsModal}>Appointments</button>
          <button onClick={openUserHistoryModal}>User History</button>
        </div>
      </div>

      {isAppointmentsModalOpen && (
        <div className="modal-overlay">
          <div className="appointments-modal">
            <i className="fas fa-times modal-close" onClick={closeAppointmentsModal}></i>
            <Appointments userId={userId} />
          </div>
        </div>
      )}

      {isUserHistoryModalOpen && (
        <div className="modal-overlay">
          <div className="userhistory-modal">
            <i className="fas fa-times modal-close" onClick={closeUserHistoryModal}></i>
            <UserHistory userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
