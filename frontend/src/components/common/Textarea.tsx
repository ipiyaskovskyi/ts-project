import React from 'react';

interface TextareaProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
    error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
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
        resize: 'vertical',
        fontFamily: 'inherit',
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = 'var(--color-status-in-progress)';
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = error
            ? '#dc2626'
            : 'var(--color-border)';
        onBlur?.(e);
    };

    return (
        <textarea
            {...props}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
};
