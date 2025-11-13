import React from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

interface ModalHeaderProps {
    heading: string;
    ticketLink?: { label: string; href: string } | null;
    onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
    heading,
    ticketLink,
    onClose,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-lg)',
            }}
        >
            <div>
                <h2
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        margin: 0,
                    }}
                >
                    {heading}
                </h2>
                {ticketLink && (
                    <Link
                        to={ticketLink.href}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px',
                            fontSize: '0.85rem',
                            color: 'var(--color-status-in-progress)',
                            textDecoration: 'none',
                        }}
                    >
                        {ticketLink.label}
                    </Link>
                )}
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-secondary)',
                    transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                        'var(--color-bg-tertiary)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
            >
                <FiX size={20} />
            </button>
        </div>
    );
};
