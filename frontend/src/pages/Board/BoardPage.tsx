import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteTask, fetchTaskById, updateTask } from '../../api/tasks';
import type { Status, Task, Priority, TaskType } from '../../types';
import { Header } from '../../components/Layout/Header';

export const BoardPage: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TaskType>('Task');
    const [status, setStatus] = useState<Status>('draft');
    const [priority, setPriority] = useState<Priority>('medium');
    const [deadline, setDeadline] = useState('');

    const statusOptions: Status[] = useMemo(
        () => ['draft', 'in_progress', 'editing', 'done'],
        []
    );
    const priorityOptions: Priority[] = useMemo(
        () => ['low', 'medium', 'high', 'urgent'],
        []
    );
    const typeOptions: TaskType[] = useMemo(
        () => ['Task', 'Subtask', 'Bug', 'Story', 'Epic'],
        []
    );

    useEffect(() => {
        const loadTask = async () => {
            if (!ticketId) {
                setError('Ticket ID is missing');
                setIsLoading(false);
                return;
            }

            const numericId = Number(ticketId);
            if (Number.isNaN(numericId)) {
                setError('Invalid ticket ID');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const fetchedTask = await fetchTaskById(numericId);
                setTask(fetchedTask);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load the ticket'
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadTask();
    }, [ticketId]);

    useEffect(() => {
        if (!task) {
            return;
        }

        setTitle(task.title);
        setDescription(task.description ?? '');
        setType(task.type ?? 'Task');
        setStatus(task.status);
        setPriority(task.priority);
        setDeadline(task.deadline ? formatDateInput(task.deadline) : '');
    }, [task]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!task) {
            setError('Cannot update unknown ticket');
            return;
        }

        if (!title.trim()) {
            setError('Title cannot be empty');
            return;
        }

        try {
            setIsSubmitting(true);
            const updated = await updateTask(task.id, {
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                priority,
                deadline: deadline
                    ? new Date(deadline).toISOString()
                    : undefined,
            });
            setTask(updated);
            setSuccess('Changes saved successfully.');
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to update the ticket'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!task) {
            return;
        }

        setError(null);
        setSuccess(null);
        try {
            setIsDeleting(true);
            await deleteTask(task.id);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to delete the ticket'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Header />
            <div
                style={{
                    padding: 'var(--spacing-xxl)',
                    maxWidth: 960,
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-lg)',
                }}
            >
                {isLoading ? (
                    <div
                        style={{
                            padding: 'var(--spacing-lg)',
                            textAlign: 'center',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Loading ticket...
                    </div>
                ) : error ? (
                    <div
                        style={{
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #ef4444',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                        }}
                    >
                        {error}
                    </div>
                ) : !task ? (
                    <div>Ticket not found.</div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            padding: 'var(--spacing-xl)',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg-primary)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-lg)',
                        }}
                    >
                        <header
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 'var(--spacing-md)',
                            }}
                        >
                            <div>
                                <h1
                                    style={{
                                        margin: 0,
                                        fontSize: '1.75rem',
                                        color: 'var(--color-text-primary)',
                                    }}
                                >
                                    Edit Ticket
                                </h1>
                                <p
                                    style={{
                                        marginTop: 'var(--spacing-xs)',
                                        color: 'var(--color-text-secondary)',
                                    }}
                                >
                                    TM-{task.id}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting || isSubmitting}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #dc2626',
                                    backgroundColor: isDeleting
                                        ? '#fee2e2'
                                        : 'transparent',
                                    color: '#dc2626',
                                    cursor:
                                        isDeleting || isSubmitting
                                            ? 'not-allowed'
                                            : 'pointer',
                                    opacity:
                                        isDeleting || isSubmitting ? 0.7 : 1,
                                }}
                            >
                                <InfoIcon />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </header>

                        {success && (
                            <div
                                style={{
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #22c55e',
                                    backgroundColor: '#dcfce7',
                                    color: '#15803d',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {success}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="ticket-title"
                                style={{
                                    display: 'block',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: 'var(--spacing-xs)',
                                }}
                            >
                                Title
                            </label>
                            <input
                                id="ticket-title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="ticket-description"
                                style={{
                                    display: 'block',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: 'var(--spacing-xs)',
                                }}
                            >
                                Description
                            </label>
                            <textarea
                                id="ticket-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                rows={6}
                                style={{
                                    ...inputStyle,
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: 'var(--spacing-md)',
                            }}
                        >
                            <Field
                                label="Status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value as Status)
                                }
                                options={statusOptions}
                            />
                            <Field
                                label="Priority"
                                value={priority}
                                onChange={(event) =>
                                    setPriority(event.target.value as Priority)
                                }
                                options={priorityOptions}
                            />
                            <Field
                                label="Type"
                                value={type}
                                onChange={(event) =>
                                    setType(event.target.value as TaskType)
                                }
                                options={typeOptions}
                            />
                            <div>
                                <label
                                    htmlFor="ticket-deadline"
                                    style={{
                                        display: 'block',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        marginBottom: 'var(--spacing-xs)',
                                    }}
                                >
                                    Deadline
                                </label>
                                <input
                                    id="ticket-deadline"
                                    type="date"
                                    value={deadline}
                                    onChange={(event) =>
                                        setDeadline(event.target.value)
                                    }
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 'var(--spacing-sm)',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                style={{
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isDeleting}
                                style={{
                                    padding:
                                        'var(--spacing-sm) var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    backgroundColor:
                                        'var(--color-status-in-progress)',
                                    color: 'white',
                                    cursor:
                                        isSubmitting || isDeleting
                                            ? 'not-allowed'
                                            : 'pointer',
                                    opacity:
                                        isSubmitting || isDeleting ? 0.7 : 1,
                                }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

interface FieldProps {
    label: string;
    value: string;
    options: string[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Field: React.FC<FieldProps> = ({ label, value, options, onChange }) => (
    <div>
        <label
            style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: 'var(--spacing-xs)',
            }}
        >
            {label}
        </label>
        <select value={value} onChange={onChange} style={inputStyle}>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    fontSize: '0.95rem',
    transition: 'border-color var(--transition-fast)',
};

const InfoIcon: React.FC = () => (
    <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8 14.667a6.667 6.667 0 1 0 0-13.334 6.667 6.667 0 0 0 0 13.334Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8 10.667V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8 5.333h.007"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function formatDateInput(date: Date | string): string {
    const instance = date instanceof Date ? date : new Date(date);
    const year = instance.getFullYear();
    const month = `${instance.getMonth() + 1}`.padStart(2, '0');
    const day = `${instance.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}
