import React from 'react';

interface FormFieldProps {
    label: string;
    id: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    id,
    required = false,
    error,
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
            {error && (
                <div
                    style={{
                        marginTop: 'var(--spacing-xs)',
                        fontSize: '0.75rem',
                        color: '#dc2626',
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
};
