import React from 'react';

interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'style'> {
    error?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    error = false,
    onFocus,
    onBlur,
    children,
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
        cursor: 'pointer',
        transition: 'border-color var(--transition-fast)',
    };

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = 'var(--color-status-in-progress)';
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = error
            ? '#dc2626'
            : 'var(--color-border)';
        onBlur?.(e);
    };

    return (
        <select
            {...props}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            {children}
        </select>
    );
};
