import React from 'react';

interface CircularProgressProps {
    percentage: number;
    label: string;
    color: string;
    size?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    label,
    color,
    size = 80,
}) => {
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedPercentage / 100) * circumference;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
            }}
        >
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--color-bg-tertiary)"
                        strokeWidth="6"
                    />
                    {}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{
                            transition:
                                'stroke-dashoffset var(--transition-normal)',
                        }}
                    />
                </svg>
                {}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    {label}
                </div>
            </div>
            <div
                style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: '500',
                }}
            >
                {clampedPercentage}%
            </div>
        </div>
    );
};
