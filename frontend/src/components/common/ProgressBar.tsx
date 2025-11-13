import React from 'react';

interface ProgressBarProps {
    progress: number;
    color?: string;
    showLabel?: boolean;
    height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    color = 'var(--color-status-in-progress)',
    showLabel = false,
    height = '8px',
}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    width: '100%',
                    height,
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        width: `${clampedProgress}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: 'var(--radius-md)',
                        transition: 'width var(--transition-normal)',
                    }}
                />
            </div>
            {showLabel && (
                <div
                    style={{
                        marginTop: '0.25rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    Progress {clampedProgress}%
                </div>
            )}
        </div>
    );
};
