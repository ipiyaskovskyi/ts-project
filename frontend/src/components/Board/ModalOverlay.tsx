import React from 'react';

interface ModalOverlayProps {
    onClose: () => void;
    children: React.ReactNode;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
    onClose,
    children,
}) => {
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            role="presentation"
            onMouseDown={handleOverlayClick}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: 'var(--spacing-lg)',
            }}
        >
            <div
                style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--spacing-xl)',
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--color-border)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                {children}
            </div>
        </div>
    );
};
