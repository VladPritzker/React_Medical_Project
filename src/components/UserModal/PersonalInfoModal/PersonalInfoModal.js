import React, { useState, useEffect } from 'react';
import './PersonalInfoModal.css';

const PersonalInfoModal = ({ userId, onClose }) => {
    const [userInfo, setUserInfo] = useState({
        full_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        email: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8001/user_detail/${userId}/`);
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    console.error('Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8001/user_detail/${userId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });

            if (response.ok) {
                alert('User info updated successfully');
                onClose();
            } else {
                alert('Failed to update user info');
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Error updating user info');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);


    return (
        <div className="personal-info-modal-overlay">
            <div className="personal-info-modal-content">
                <h2>Personal Information</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="full_name"
                        value={userInfo.full_name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="date"
                        name="date_of_birth"
                        value={userInfo.date_of_birth}
                        onChange={handleInputChange}
                        placeholder="Date of Birth"
                        required
                    />
                    <select
                        name="gender"
                        value={userInfo.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input
                        type="text"
                        name="address"
                        value={userInfo.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        required
                    />
                    <input
                        type="text"
                        name="phone_number"
                        value={userInfo.phone_number}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        required
                    />
                    <input
                        type="text"
                        name="emergency_contact_name"
                        value={userInfo.emergency_contact_name}
                        onChange={handleInputChange}
                        placeholder="Emergency Contact Name"
                        required
                    />
                    <input
                        type="text"
                        name="emergency_contact_relationship"
                        value={userInfo.emergency_contact_relationship}
                        onChange={handleInputChange}
                        placeholder="Emergency Contact Relationship"
                        required
                    />
                    <input
                        type="text"
                        name="emergency_contact_phone"
                        value={userInfo.emergency_contact_phone}
                        onChange={handleInputChange}
                        placeholder="Emergency Contact Phone"
                        required
                    />
                    <button type="submit">Save</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default PersonalInfoModal;
