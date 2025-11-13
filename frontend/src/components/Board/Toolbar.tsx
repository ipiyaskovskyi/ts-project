import React, { useState } from 'react';
import { FiPlus, FiX, FiFilter } from 'react-icons/fi';
import type { Status, Priority } from '../../types';

interface FilterState {
    status: Status | '';
    priority: Priority | '';
    createdFrom: string;
    createdTo: string;
}

interface ToolbarProps {
    onCreateTask: () => void;
    onFilterChange: (filters: FilterState) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    onCreateTask,
    onFilterChange,
}) => {
    const [filters, setFilters] = useState<FilterState>({
        status: '',
        priority: '',
        createdFrom: '',
        createdTo: '',
    });

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters: FilterState = {
            status: '',
            priority: '',
            createdFrom: '',
            createdTo: '',
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const hasActiveFilters =
        filters.status ||
        filters.priority ||
        filters.createdFrom ||
        filters.createdTo;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: 'var(--color-bg-primary)',
                borderBottom: '1px solid var(--color-border)',
                gap: 'var(--spacing-md)',
                flexWrap: 'wrap',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                }}
            >
                <button
                    onClick={onCreateTask}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: 'var(--color-status-in-progress)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                            'var(--color-status-in-progress)';
                    }}
                >
                    <FiPlus size={18} />
                    <span>Create Task</span>
                </button>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    flexWrap: 'wrap',
                    position: 'relative',
                }}
            >
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: hasActiveFilters
                            ? 'var(--color-status-in-progress)'
                            : 'var(--color-bg-primary)',
                        color: hasActiveFilters
                            ? 'white'
                            : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        if (!hasActiveFilters) {
                            e.currentTarget.style.borderColor =
                                'var(--color-status-in-progress)';
                            e.currentTarget.style.color =
                                'var(--color-status-in-progress)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!hasActiveFilters) {
                            e.currentTarget.style.borderColor =
                                'var(--color-border)';
                            e.currentTarget.style.color =
                                'var(--color-text-secondary)';
                        }
                    }}
                >
                    <FiFilter size={18} />
                    <span>Filters</span>
                    {hasActiveFilters && (
                        <span
                            style={{
                                backgroundColor: 'white',
                                color: 'var(--color-status-in-progress)',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                            }}
                        >
                            {
                                [
                                    filters.status,
                                    filters.priority,
                                    filters.createdFrom,
                                    filters.createdTo,
                                ].filter(Boolean).length
                            }
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-bg-primary)',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#dc2626';
                            e.currentTarget.style.color = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                                'var(--color-border)';
                            e.currentTarget.style.color =
                                'var(--color-text-secondary)';
                        }}
                    >
                        <FiX size={16} />
                        <span>Clear</span>
                    </button>
                )}

                {isFiltersOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + var(--spacing-sm))',
                            right: 0,
                            backgroundColor: 'var(--color-bg-primary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)',
                            boxShadow: 'var(--shadow-lg)',
                            zIndex: 1000,
                            minWidth: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-md)',
                        }}
                    >
                        <div>
                            <label
                                htmlFor="filter-status"
                                style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: 'var(--spacing-xs)',
                                }}
                            >
                                Status
                            </label>
                            <select
                                id="filter-status"
                                value={filters.status}
                                onChange={(e) =>
                                    handleFilterChange('status', e.target.value)
                                }
                                style={{
                                    width: '100%',
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    color: 'var(--color-text-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="">All Statuses</option>
                                <option value="draft">Draft</option>
                                <option value="in_progress">In Progress</option>
                                <option value="editing">Editing</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="filter-priority"
                                style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: 'var(--spacing-xs)',
                                }}
                            >
                                Priority
                            </label>
                            <select
                                id="filter-priority"
                                value={filters.priority}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'priority',
                                        e.target.value
                                    )
                                }
                                style={{
                                    width: '100%',
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    color: 'var(--color-text-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="filter-created-from"
                                style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: 'var(--spacing-xs)',
                                }}
                            >
                                Created From
                            </label>
                            <input
                                id="filter-created-from"
                                type="date"
                                value={filters.createdFrom}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'createdFrom',
                                        e.target.value
                                    )
                                }
                                style={{
                                    width: '100%',
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    color: 'var(--color-text-primary)',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="filter-created-to"
                                style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: 'var(--spacing-xs)',
                                }}
                            >
                                Created To
                            </label>
                            <input
                                id="filter-created-to"
                                type="date"
                                value={filters.createdTo}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'createdTo',
                                        e.target.value
                                    )
                                }
                                style={{
                                    width: '100%',
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    color: 'var(--color-text-primary)',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
