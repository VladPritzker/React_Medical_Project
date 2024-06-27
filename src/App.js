import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationModal/RegistrationModal';
import UserModal from './components/UserModal/UserModal';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/registration" />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/users/:userId" element={<UserModal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
