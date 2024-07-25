import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import './AddHealthHistoryModal.css';

const AddHealthHistoryModal = ({ userId, onClose, onAdd }) => {
    const [date, setDate] = useState(''); // State for date input
    const [doctor, setDoctor] = useState(''); // State for doctor input
    const [treatment, setTreatment] = useState(''); // State for treatment input
    const [condition, setCondition] = useState(''); // State for condition input

    const handleAddHealthHistory = async () => {
        // Check if all fields are filled
        if (!date || !treatment || !doctor || !condition) {
            alert('Please fill out all fields');
            return;
        }

        const newHealthHistory = {
            date,
            doctor,
            treatment,
            condition,
        };

        try {
            const response = await fetch(`http://localhost:8001/health_histories/${userId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newHealthHistory),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Response data from server:", data); // Log the response data from the server
                onAdd(data); // Call onAdd function with new health history data
                onClose(); // Close the modal
            } else {
                alert('Failed to add health history');
            }
        } catch (error) {
            console.error('Error adding health history:', error);
            alert('Error adding health history');
        }
    };

    return (
        <div className="add-health-history-modal-overlay">
            <div className="add-health-history-modal-content">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="add-health-history-close-icon"
                    onClick={onClose}
                />
                <h2>Add Health History</h2>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Date"
                    className="add-health-history-input"
                />
                <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="Condition"
                    className="add-health-history-input"
                />
                <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="Doctor"
                    className="add-health-history-input"
                />
                <input
                    type="text"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Treatment"
                    className="add-health-history-input"
                />
                <button
                    onClick={handleAddHealthHistory} // Call handleAddHealthHistory on button click
                    className="add-health-history-button"
                >
                    Add Health History
                </button>
            </div>
        </div>
    );
};

export default AddHealthHistoryModal;
