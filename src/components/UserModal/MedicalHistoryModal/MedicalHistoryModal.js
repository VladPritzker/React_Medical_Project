import React, { useState, useEffect } from 'react';
import './MedicalHistoryModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MedicalHistoryModal = ({ userId, onClose }) => {
    const [medicalHistories, setMedicalHistories] = useState([]);
    const [newMedicalHistory, setNewMedicalHistory] = useState({
        primary_care_physician_name: '',
        primary_care_physician_address: '',
        primary_care_physician_phone_number: '',
        medical_conditions: '',
        current_medications: '',
        past_surgeries_or_hospitalizations: '',
        family_medical_history: '',
        immunization_records: ''
    });

    useEffect(() => {
        const fetchMedicalHistories = async () => {
            try {
                const response = await fetch(`http://localhost:8001/medical_histories/${userId}/`);
                if (response.ok) {
                    const data = await response.json();
                    setMedicalHistories(data);
                } else {
                    console.error('Failed to fetch medical histories');
                }
            } catch (error) {
                console.error('Error fetching medical histories:', error);
            }
        };

        fetchMedicalHistories();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMedicalHistory({ ...newMedicalHistory, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8001/medical_histories/${userId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMedicalHistory),
            });

            if (response.ok) {
                const data = await response.json();
                setMedicalHistories([...medicalHistories, data]);
                setNewMedicalHistory({
                    primary_care_physician_name: '',
                    primary_care_physician_address: '',
                    primary_care_physician_phone_number: '',
                    medical_conditions: '',
                    current_medications: '',
                    past_surgeries_or_hospitalizations: '',
                    family_medical_history: '',
                    immunization_records: ''
                });
            } else {
                console.error('Failed to add medical history');
            }
        } catch (error) {
            console.error('Error adding medical history:', error);
        }
    };
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);



    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8001/medical_histories/${userId}/${id}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMedicalHistories(medicalHistories.filter(history => history.id !== id));
            } else {
                console.error('Failed to delete medical history');
            }
        } catch (error) {
            console.error('Error deleting medical history:', error);
        }
    };

    return (
        <div className="medical-history-modal-overlay">
            <div className="medical-history-modal-content">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="medical-history-close-icon"
                    onClick={onClose}
                />
                <h2>Medical History</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="primary_care_physician_name"
                        value={newMedicalHistory.primary_care_physician_name}
                        onChange={handleInputChange}
                        placeholder="Primary Care Physician Name"
                        required
                    />
                    <input
                        type="text"
                        name="primary_care_physician_address"
                        value={newMedicalHistory.primary_care_physician_address}
                        onChange={handleInputChange}
                        placeholder="Primary Care Physician Address"
                        required
                    />
                    <input
                        type="text"
                        name="primary_care_physician_phone_number"
                        value={newMedicalHistory.primary_care_physician_phone_number}
                        onChange={handleInputChange}
                        placeholder="Primary Care Physician Phone Number"
                        required
                    />
                    <input
                        type="text"
                        name="medical_conditions"
                        value={newMedicalHistory.medical_conditions}
                        onChange={handleInputChange}
                        placeholder="Medical Conditions"
                        required
                    />
                    <input
                        type="text"
                        name="current_medications"
                        value={newMedicalHistory.current_medications}
                        onChange={handleInputChange}
                        placeholder="Current Medications"
                        required
                    />
                    <input
                        type="text"
                        name="past_surgeries_or_hospitalizations"
                        value={newMedicalHistory.past_surgeries_or_hospitalizations}
                        onChange={handleInputChange}
                        placeholder="Past Surgeries or Hospitalizations"
                        required
                    />
                    <input
                        type="text"
                        name="family_medical_history"
                        value={newMedicalHistory.family_medical_history}
                        onChange={handleInputChange}
                        placeholder="Family Medical History"
                        required
                    />
                    <input
                        type="text"
                        name="immunization_records"
                        value={newMedicalHistory.immunization_records}
                        onChange={handleInputChange}
                        placeholder="Immunization Records"
                        required
                    />
                    <button type="submit">Save</button>
                </form>
                <ul>
                    {medicalHistories.map(history => (
                        <li key={history.id}>
                            <p><strong>Physician:</strong> {history.primary_care_physician_name}</p>
                            <p><strong>Address:</strong> {history.primary_care_physician_address}</p>
                            <p><strong>Phone:</strong> {history.primary_care_physician_phone_number}</p>
                            <p><strong>Conditions:</strong> {history.medical_conditions}</p>
                            <p><strong>Medications:</strong> {history.current_medications}</p>
                            <p><strong>Surgeries/Hospitalizations:</strong> {history.past_surgeries_or_hospitalizations}</p>
                            <p><strong>Family History:</strong> {history.family_medical_history}</p>
                            <p><strong>Immunizations:</strong> {history.immunization_records}</p>
                            <button onClick={() => handleDelete(history.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MedicalHistoryModal;
