import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, profileSetupRequired } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium text-sm animate-pulse-slow">
            Securing your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If work profile is incomplete, force them to '/setup-profile'
  if (profileSetupRequired && location.pathname !== '/setup-profile') {
    return <Navigate to="/setup-profile" replace />;
  }

  // If profile is already complete, don't let them go to '/setup-profile'
  if (!profileSetupRequired && location.pathname === '/setup-profile') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
