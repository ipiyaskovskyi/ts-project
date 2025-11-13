import React from 'react';

interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
    error?: boolean;
}

export const Input: React.FC<InputProps> = ({
    error = false,
    onFocus,
    onBlur,
    ...props
}) => {
    const baseStyle: React.CSSProperties = {
        width: '100%',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        border: `1px solid ${error ? '#dc2626' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        transition: 'border-color var(--transition-fast)',
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = 'var(--color-status-in-progress)';
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = error
            ? '#dc2626'
            : 'var(--color-border)';
        onBlur?.(e);
    };

    return (
        <input
            {...props}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
};
