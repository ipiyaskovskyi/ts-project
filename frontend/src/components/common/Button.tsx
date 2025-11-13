import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    isLoading = false,
    disabled,
    children,
    className,
    onMouseEnter,
    onMouseLeave,
    style,
    ...props
}) => {
    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case 'danger':
                return {
                    border: '1px solid #dc2626',
                    backgroundColor: isLoading ? '#fee2e2' : 'transparent',
                    color: '#dc2626',
                };
            case 'secondary':
                return {
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-secondary)',
                };
            default:
                return {
                    border: 'none',
                    backgroundColor: 'var(--color-status-in-progress)',
                    color: 'white',
                };
        }
    };

    const baseStyle: React.CSSProperties = {
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        opacity: isLoading || disabled ? 0.7 : 1,
        ...getVariantStyles(),
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading || disabled) return;
        if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#2563eb';
        } else if (variant === 'secondary') {
            e.currentTarget.style.borderColor = 'var(--color-text-secondary)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
        }
        onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (variant === 'primary') {
            e.currentTarget.style.backgroundColor =
                'var(--color-status-in-progress)';
        } else if (variant === 'secondary') {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
        }
        onMouseLeave?.(e);
    };

    const finalStyle = className ? undefined : { ...baseStyle, ...style };

    return (
        <button
            {...props}
            className={className}
            style={finalStyle}
            disabled={isLoading || disabled}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </button>
    );
};
