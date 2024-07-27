import React, { useState, useEffect } from 'react';
import './InsuranceInformationModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InsuranceInformationModal = ({ userId, onClose }) => {
    const [insuranceInfo, setInsuranceInfo] = useState({
        insurance_provider_name: '',
        insurance_policy_number: '',
        group_number: '',
        policy_holder_name: '',
        relationship_to_policy_holder: '',
        insurance_provider_phone_number: ''
    });

    // Fetch the existing insurance information when the component is mounted
    useEffect(() => {
        const fetchInsuranceInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8001/insurance_information/${userId}/`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setInsuranceInfo(data[0]);  // Assuming only one record per user
                    }
                } else {
                    console.error('Failed to fetch insurance info');
                }
            } catch (error) {
                console.error('Error fetching insurance info:', error);
            }
        };

        fetchInsuranceInfo();
    }, [userId]);

    // Handle input changes and update the state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInsuranceInfo({ ...insuranceInfo, [name]: value });
    };

    // Handle form submission to save the updated insurance information
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8001/insurance_information/${userId}/`, {
                method: 'PATCH',  // Use PATCH to update existing info
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(insuranceInfo),
            });
    
            if (response.ok) {
                alert('Insurance info updated successfully');
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Error data:', errorData);  // Log error data
                alert('Failed to update insurance info');
            }
        } catch (error) {
            console.error('Error updating insurance info:', error);
            alert('Error updating insurance info');
        }
    };
    
    // Render the modal for insurance information
    return (
        <div className="insurance-info-modal-overlay">
            <div className="insurance-info-modal-content">
                <FontAwesomeIcon
                    icon={faTimes}
                    className="insurance-info-close-icon"
                    onClick={onClose}
                />
                <h2>Insurance Information</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="insurance_provider_name"
                        value={insuranceInfo.insurance_provider_name}
                        onChange={handleInputChange}
                        placeholder="Insurance Provider Name"
                        required
                    />
                    <input
                        type="text"
                        name="insurance_policy_number"
                        value={insuranceInfo.insurance_policy_number}
                        onChange={handleInputChange}
                        placeholder="Insurance Policy Number"
                        required
                    />
                    <input
                        type="text"
                        name="group_number"
                        value={insuranceInfo.group_number}
                        onChange={handleInputChange}
                        placeholder="Group Number"
                        required
                    />
                    <input
                        type="text"
                        name="policy_holder_name"
                        value={insuranceInfo.policy_holder_name}
                        onChange={handleInputChange}
                        placeholder="Policy Holder's Name"
                        required
                    />
                    <input
                        type="text"
                        name="relationship_to_policy_holder"
                        value={insuranceInfo.relationship_to_policy_holder}
                        onChange={handleInputChange}
                        placeholder="Relationship to Policy Holder"
                        required
                    />
                    <input
                        type="text"
                        name="insurance_provider_phone_number"
                        value={insuranceInfo.insurance_provider_phone_number}
                        onChange={handleInputChange}
                        placeholder="Insurance Provider Phone Number"
                        required
                    />
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default InsuranceInformationModal;
