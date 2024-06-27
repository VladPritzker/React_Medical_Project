import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../UserModal/UserModal.css';

const UserModal = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);

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
        {userData.avatar && (
          <img src={`http://localhost:8001${userData.avatar}`} alt="User Avatar" className="avatar" />
        )}
        <input type="file" onChange={handleAvatarChange} />
        <button onClick={handleAvatarUpload}>Upload Avatar</button>
      </div>
    </div>
  );
};

export default UserModal;
