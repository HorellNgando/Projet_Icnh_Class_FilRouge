import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} />;
    }

    if (Array.isArray(role)) {
        if (!role.includes(userRole)) {
            return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} />;
        }
    } else {
        if (userRole !== role) {
            return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} />;
        }
    }

    return children;
};

export default ProtectedRoute;