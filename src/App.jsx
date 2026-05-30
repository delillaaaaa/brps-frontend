import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetupProfilePage from './pages/SetupProfilePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import PredictionLoadingPage from './pages/PredictionLoadingPage';
import PredictionResultPage from './pages/PredictionResultPage';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/setup-profile" 
        element={
          <ProtectedRoute>
            <SetupProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assessment" 
        element={
          <ProtectedRoute>
            <AssessmentPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assessment/:id/predict" 
        element={
          <ProtectedRoute>
            <PredictionLoadingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assessment/:id/result" 
        element={
          <ProtectedRoute>
            <PredictionResultPage />
          </ProtectedRoute>
        } 
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
