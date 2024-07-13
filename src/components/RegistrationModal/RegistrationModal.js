import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../RegistrationModal/RegistrationModal.css';

const RegistrationForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8001/users/';
    const action = isRegistering ? 'register' : 'login';
    const data = {
      action: action,
      ...formData
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        if (action === 'login') {
          navigate(`/users/${result.user_id}`);
        } else {
          alert('Registration successful. Please login.');
          setIsRegistering(false);
          setFormData({
            username: '',
            email: '',
            password: ''
          });
        }
      } else {
        console.error('Error response:', result);
        alert(result.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setFormData({
      username: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {isRegistering && (
          <div className="label-container">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required={isRegistering}
            />
          </div>
        )}
        <div className="label-container">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="label-container">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        <button type="button" onClick={toggleForm}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
