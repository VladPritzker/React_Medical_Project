import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../components/UserModal/UserModal.css';

const UserModal = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

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

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h2>User Details</h2>
      </div>
      <div className="user-card-body">
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>
    </div>
  );
};

export default UserModal;
