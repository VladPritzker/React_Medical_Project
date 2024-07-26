import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import faTrash icon
import './HealthHistoryModal.css';
import AddHealthHistoryModal from './AddHealthHistoryModal/AddHealthHistoryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal/DeleteConfirmationModal';

const HealthHistoryModal = ({ userId, onClose }) => {
    const [healthHistories, setHealthHistories] = useState([]); // State to store health histories
    const [showHealthHistoryModal, setShowHealthHistoryModal] = useState(false); // State to control the visibility of the AddHealthHistoryModal
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false); // State to control the visibility of the DeleteConfirmationModal
    const [recordToDelete, setRecordToDelete] = useState(null); // State to store the record to be deleted

    // Function to fetch health histories for the user
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
        setHealthHistories((prevHistories) => [...prevHistories, newHealthHistory]); // Update healthHistories state
    };

    const handleDeleteHealthHistory = async () => {
        if (recordToDelete) {
            try {
                const response = await fetch(`http://localhost:8001/health_histories/${userId}/${recordToDelete.id}/`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setHealthHistories((prevHistories) => prevHistories.filter(history => history.id !== recordToDelete.id)); // Remove deleted history from state
                    setShowDeleteConfirmationModal(false); // Close the delete confirmation modal
                } else {
                    alert('Failed to delete health history');
                }
            } catch (error) {
                console.error('Error deleting health history:', error);
                alert('Error deleting health history');
            }
        }
    };

    const openDeleteConfirmationModal = (history) => {
        setRecordToDelete(history); // Set the record to be deleted
        setShowDeleteConfirmationModal(true); // Show the delete confirmation modal
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
                                    onClick={() => openDeleteConfirmationModal(history)} // Call openDeleteConfirmationModal on button click
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
            {showDeleteConfirmationModal && (
                <DeleteConfirmationModal
                    onClose={() => setShowDeleteConfirmationModal(false)} // Close the DeleteConfirmationModal on close
                    onConfirm={handleDeleteHealthHistory} // Call handleDeleteHealthHistory on confirm
                />
            )}
        </div>
    );
};

export default HealthHistoryModal;
