import React from 'react';

interface FormFieldProps {
    label: string;
    id: string;
    required?: boolean;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    id,
    required = false,
    children,
}) => {
    return (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label
                htmlFor={id}
                style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)',
                }}
            >
                {label}
                {required && <span style={{ color: '#dc2626' }}> *</span>}
            </label>
            {children}
        </div>
    );
};
