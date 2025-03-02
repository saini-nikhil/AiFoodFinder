import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // If still loading auth state, show nothing or a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;