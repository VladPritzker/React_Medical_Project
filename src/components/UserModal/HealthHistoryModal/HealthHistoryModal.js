import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import faTrash icon
import './HealthHistoryModal.css';
import AddHealthHistoryModal from './AddHealthHistoryModal/AddHealthHistoryModal';

const HealthHistoryModal = ({ userId, onClose }) => {
    const [healthHistories, setHealthHistories] = useState([]); // State to store health histories
    const [showHealthHistoryModal, setShowHealthHistoryModal] = useState(false); // State to control the visibility of the AddHealthHistoryModal

    const fetchHealthHistories = async () => {
        try {
            const response = await fetch(`http://localhost:8001/health_histories/${userId}/`);
            if (response.ok) {
                const data = await response.json();
                setHealthHistories(data); // Update state with fetched health histories
            } else {
                console.error('Failed to fetch health histories');
            }
        } catch (error) {
            console.error('Error fetching health histories:', error);
        }
    };

    useEffect(() => {
        fetchHealthHistories();
    }, [userId]); // Re-fetch health histories when userId changes

    // Effect to refetch health histories when the healthHistories state changes
    useEffect(() => {
        fetchHealthHistories();
    }, [healthHistories]);


    const handleAddHealthHistory = (newHealthHistory) => {
        console.log("New Health History added:", newHealthHistory); // Log the new health history
        // Update health histories state with new health history
        setHealthHistories((prevHistories) => [...prevHistories, newHealthHistory]);
    };

    const handleDeleteHealthHistory = async (id) => {
        try {
            const response = await fetch(`http://localhost:8001/health_histories/${userId}/${id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setHealthHistories((prevHistories) => prevHistories.filter(history => history.id !== id)); // Remove deleted history from state
            } else {
                alert('Failed to delete health history');
            }
        } catch (error) {
            console.error('Error deleting health history:', error);
            alert('Error deleting health history');
        }
    };



    return (
        <div className="health-history-modal-overlay">
            <div className="health-history-modal-content">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="health-history-close-icon"
                    onClick={onClose}
                />
                <h2>Health History</h2>
                <button
                    className="add-appointment-button"
                    onClick={() => setShowHealthHistoryModal(true)} // Show AddHealthHistoryModal on button click
                >
                    <FontAwesomeIcon icon={faPlus} /> Add Health History
                </button>
                {healthHistories.length > 0 ? (
                    <ul className="health-history-list">
                        {healthHistories.map((history) => (
                            <li key={history.id} className="health-history-item">
                                <p><strong>Condition:</strong> {history.condition}</p>
                                <p><strong>Doctor:</strong> {history.doctor}</p>
                                <p><strong>Treatment:</strong> {history.treatment}</p>
                                <p><strong>Date:</strong> {history.date}</p>
                                <button
                                    className="delete-health-history-button"
                                    onClick={() => handleDeleteHealthHistory(history.id)} // Call handleDeleteHealthHistory on button click
                                >
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No health histories found.</p>
                )}
            </div>
            {showHealthHistoryModal && (
                <AddHealthHistoryModal
                    userId={userId}
                    onClose={() => setShowHealthHistoryModal(false)} // Hide AddHealthHistoryModal on close
                    onAdd={handleAddHealthHistory} // Pass handleAddHealthHistory to AddHealthHistoryModal
                />
            )}
        </div>
    );
};

export default HealthHistoryModal;
