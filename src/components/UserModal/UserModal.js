import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserModal.css';

const UserModal = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8001/users/${userId}/`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    navigate('/registration');
  };

  if (!userData) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="user-card">
          <button className="close-button" onClick={() => navigate('/registration')}>X</button>
          <div className="user-modal-header">
            <h2>{userData.username}'s Profile</h2>
          </div>
          <div className="user-modal-body">
            <div className="profile-section">
              <h3>Profile Photo</h3>
              <img src="default-profile.jpg" alt="Profile" className="profile-photo"/>
              <button className="upload-button">Upload Photo</button>
            </div>
            <div className="user-info">
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
            <button className="modal-button" onClick={handleLogout}>Log Out</button>
            <button className="modal-button">Appointment</button>
            <button className="modal-button">User History</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
