import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationModal/RegistrationModal';
import UserPage from '../src/components/UserModal/UserModal';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/registration" />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/users/:userId" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
