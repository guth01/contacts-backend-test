import React from 'react';
import './tailwind.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import the components we've created
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dash from './components/dashboard';
import AddContact from './components/addContacts';
import ViewContacts from './components/viewContacts';

// Create a protected route component to use for authenticated routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dash/>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-contact" 
            element={
              <ProtectedRoute>
                <AddContact/>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/contacts" 
            element={
              <ProtectedRoute>
                <ViewContacts/>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;