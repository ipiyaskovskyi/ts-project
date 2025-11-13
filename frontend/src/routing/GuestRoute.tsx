import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface GuestRouteProps {
    children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    fontSize: '1rem',
                    color: 'var(--color-text-secondary)',
                }}
            >
                Loading...
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
