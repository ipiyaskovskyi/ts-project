import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div
            style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: 'var(--radius-md)',
                color: '#dc2626',
                fontSize: '0.875rem',
                marginBottom: 'var(--spacing-md)',
            }}
        >
            {message}
        </div>
    );
};
