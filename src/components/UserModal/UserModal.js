import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserModal.css';
import PersonalInfoModal from './PersonalInfoModal/PersonalInfoModal';
import AppointmentsModal from './AppointmentsModal/AppointmentsModal'; // Import the AppointmentsModal component
import HealthHistoryModal from './TreatmentHistoryModal/TreatmentHistoryModal';
import InsuranceInformationModal from './InsuranceInformationModal/InsuranceInformationModal'
import MedicalHistoryModal from './MedicalHistoryModal/MedicalHistoryModal';


const UserModal = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false)
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false); // State to control the visibility of the appointments modal
  const [showHealthHistoryModal, setShowHealthHistoryModal] = useState(false);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);

  const [showInsuranceInformationModal, setShowInsuranceInformationModal]= useState(false)

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await fetch(`http://localhost:8001/users/${userId}/upload_photo/`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token in the headers
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(prevData => ({ ...prevData, photo: data.file_url }));
        alert('Profile photo updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to upload image:', errorData);
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/registration');
  };

  

  if (!userData) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="user-card">
          <div className="user-modal-header">
            <button className="modal-button" onClick={handleLogout}>Log Out</button>
            <h2>{userData.username}'s Profile</h2>
          </div>
          <div className="user-modal-body">
            <div className="profile-section">
              <h3>Profile Photo</h3>
              <img src={`http://localhost:8001/${userData.photo}`} alt="Profile" className="profile-photo"/>
              <input className='user-inpute' type="file" onChange={handleFileChange} />
              <button className="upload-button" onClick={handleUpload}>Upload Photo</button>
            </div>
            <div className="user-info">
              <p><strong>Email:</strong> {userData.email}</p>
            </div>            
            <button className="modal-button" onClick={()=> setShowPersonalInfoModal(true)}>Personal Information</button>
            <button className="modal-button" onClick={()=> setShowAppointmentsModal(true)}>Appointment</button>
            <button onClick={() => setShowHealthHistoryModal(true)}>
                Treatment History
            </button>
            <button onClick={() => setShowInsuranceInformationModal(true)}>
                Insurence Information
            </button>
            <button onClick={() => setShowMedicalHistoryModal(true)}>Medical History</button>

          </div>
        </div>
      </div>
      {showAppointmentsModal && (
        <AppointmentsModal userId={userId} onClose={() => setShowAppointmentsModal(false)} />
      )}
      {showHealthHistoryModal && (
                <HealthHistoryModal
                    userId={userId}
                    onClose={() => setShowHealthHistoryModal(false)}
                />
            )}
            {showMedicalHistoryModal && (
                <MedicalHistoryModal userId={47} onClose={() => setShowMedicalHistoryModal(false)} />
            )}
      {showPersonalInfoModal && (
        <PersonalInfoModal 
        userId={userId}
        onClose={()=> setShowPersonalInfoModal(false)}
        />
      )}            
      
      {showInsuranceInformationModal && (
        <InsuranceInformationModal
        userId={userId}
        onClose={()=> setShowInsuranceInformationModal(false)}
        />
      )}            
    </div>
  );
};

export default UserModal;

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
