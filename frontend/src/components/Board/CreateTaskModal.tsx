import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Status, Priority, TaskType } from '../../types';
import { FormField } from '../common/FormField';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { ErrorMessage } from '../common/ErrorMessage';
import { ModalOverlay } from './ModalOverlay';
import { ModalHeader } from './ModalHeader';
import { ModalActions } from './ModalActions';
import {
    TASK_TYPES,
    STATUSES,
    PRIORITIES,
    STATUS_LABELS,
    PRIORITY_LABELS,
} from './constants';
import { taskFormSchema } from './taskFormSchema';

export interface TaskFormValues {
    title: string;
    description: string;
    type: TaskType;
    status: Status;
    priority: Priority;
    deadline: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialValues?: Partial<TaskFormValues>;
    onClose: () => void;
    onSubmit: (values: TaskFormValues) => Promise<void>;
    onDelete?: () => Promise<void>;
    ticketId?: number | null;
}

const DEFAULT_VALUES: TaskFormValues = {
    title: '',
    description: '',
    type: 'Task',
    status: 'todo',
    priority: 'medium',
    deadline: '',
};

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    mode,
    initialValues,
    onClose,
    onSubmit,
    onDelete,
    ticketId,
}) => {
    const mergedInitialValues = useMemo<TaskFormValues>(
        () => ({
            ...DEFAULT_VALUES,
            ...initialValues,
            deadline: initialValues?.deadline ?? DEFAULT_VALUES.deadline,
        }),
        [initialValues]
    );

    const [formState, setFormState] =
        useState<TaskFormValues>(mergedInitialValues);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof TaskFormValues, string>>
    >({});
    const [touchedFields, setTouchedFields] = useState<
        Partial<Record<keyof TaskFormValues, boolean>>
    >({});

    const updateField = useCallback(
        <K extends keyof TaskFormValues>(
            field: K,
            value: TaskFormValues[K]
        ) => {
            setFormState((prev) => {
                const newState = { ...prev, [field]: value };
                if (touchedFields[field]) {
                    const validation = taskFormSchema.safeParse(newState);
                    if (!validation.success) {
                        const fieldError = validation.error.errors.find(
                            (e) => e.path[0] === field
                        );
                        setFieldErrors((prev) => ({
                            ...prev,
                            [field]: fieldError?.message,
                        }));
                    } else {
                        setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors[field];
                            return newErrors;
                        });
                    }
                }
                return newState;
            });
        },
        [touchedFields]
    );

    const handleFieldBlur = useCallback(
        (field: keyof TaskFormValues) => {
            setTouchedFields((prev) => ({ ...prev, [field]: true }));
            const validation = taskFormSchema.safeParse(formState);
            if (!validation.success) {
                const fieldError = validation.error.errors.find(
                    (e) => e.path[0] === field
                );
                setFieldErrors((prev) => ({
                    ...prev,
                    [field]: fieldError?.message,
                }));
            } else {
                setFieldErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        },
        [formState]
    );

    const isFormValid = useMemo(() => {
        const validation = taskFormSchema.safeParse(formState);
        return validation.success;
    }, [formState]);

    const hasFormChanged = useMemo(() => {
        if (mode === 'create') {
            return (
                formState.title.trim() !== '' ||
                formState.description.trim() !== ''
            );
        }
        return (
            formState.title.trim() !== mergedInitialValues.title ||
            formState.description.trim() !==
                (mergedInitialValues.description || '') ||
            formState.type !== mergedInitialValues.type ||
            formState.status !== mergedInitialValues.status ||
            formState.priority !== mergedInitialValues.priority ||
            formState.deadline !== (mergedInitialValues.deadline || '')
        );
    }, [formState, mode, mergedInitialValues]);

    const isSubmitDisabled =
        !isFormValid || !hasFormChanged || isSubmitting || isDeleting;

    const resetFormState = useCallback(() => {
        setFormState(mergedInitialValues);
        setError('');
        setIsSubmitting(false);
        setIsDeleting(false);
        setFieldErrors({});
        setTouchedFields({});
    }, [mergedInitialValues]);

    const handleClose = useCallback(() => {
        resetFormState();
        onClose();
    }, [onClose, resetFormState]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        // Mark all fields as touched
        const allFields: (keyof TaskFormValues)[] = [
            'title',
            'description',
            'type',
            'status',
            'priority',
            'deadline',
        ];
        setTouchedFields(
            allFields.reduce(
                (acc, field) => ({ ...acc, [field]: true }),
                {} as Partial<Record<keyof TaskFormValues, boolean>>
            )
        );

        const validation = taskFormSchema.safeParse(formState);
        if (!validation.success) {
            const errors: Partial<Record<keyof TaskFormValues, string>> = {};
            validation.error.errors.forEach((err) => {
                const field = err.path[0] as keyof TaskFormValues;
                if (field) {
                    errors[field] = err.message;
                }
            });
            setFieldErrors(errors);
            return;
        }

        try {
            setIsSubmitting(true);

            await onSubmit({
                title: formState.title.trim(),
                description: formState.description.trim(),
                type: formState.type,
                status: formState.status,
                priority: formState.priority,
                deadline: formState.deadline,
            });
            handleClose();
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong while submitting the task'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) {
            return;
        }

        setError('');
        try {
            setIsDeleting(true);
            await onDelete();
            handleClose();
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error ? err.message : 'Failed to delete the task'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        resetFormState();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose, isOpen, resetFormState]);

    if (!isOpen) {
        return null;
    }

    const submitLabel =
        mode === 'edit'
            ? isSubmitting
                ? 'Saving...'
                : 'Save changes'
            : isSubmitting
              ? 'Creating...'
              : 'Create task';

    const heading = mode === 'edit' ? 'Edit Task' : 'Create New Task';

    const ticketLink =
        mode === 'edit' && ticketId != null
            ? {
                  label: `TM-${ticketId}`,
                  href: `/tickets/${ticketId}`,
              }
            : null;

    const showDeleteButton = mode === 'edit' && onDelete != null;

    return (
        <ModalOverlay onClose={handleClose}>
            <ModalHeader
                heading={heading}
                ticketLink={ticketLink}
                onClose={handleClose}
            />

            <form onSubmit={handleSubmit}>
                {error && <ErrorMessage message={error} />}

                <FormField
                    label="Task Title"
                    id="task-title"
                    required
                    error={fieldErrors.title}
                >
                    <Input
                        id="task-title"
                        type="text"
                        value={formState.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        onBlur={() => handleFieldBlur('title')}
                        placeholder="Enter task title"
                    />
                </FormField>

                <FormField label="Type" id="task-type" error={fieldErrors.type}>
                    <Select
                        id="task-type"
                        value={formState.type}
                        onChange={(e) =>
                            updateField('type', e.target.value as TaskType)
                        }
                        onBlur={() => handleFieldBlur('type')}
                    >
                        {TASK_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </Select>
                </FormField>

                <FormField
                    label="Description"
                    id="task-description"
                    error={fieldErrors.description}
                >
                    <Textarea
                        id="task-description"
                        value={formState.description}
                        onChange={(e) =>
                            updateField('description', e.target.value)
                        }
                        onBlur={() => handleFieldBlur('description')}
                        placeholder="Enter task description"
                        rows={4}
                    />
                </FormField>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-md)',
                    }}
                >
                    <FormField
                        label="Status"
                        id="task-status"
                        error={fieldErrors.status}
                    >
                        <Select
                            id="task-status"
                            value={formState.status}
                            onChange={(e) =>
                                updateField('status', e.target.value as Status)
                            }
                            onBlur={() => handleFieldBlur('status')}
                        >
                            {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {STATUS_LABELS[status]}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField
                        label="Priority"
                        id="task-priority"
                        error={fieldErrors.priority}
                    >
                        <Select
                            id="task-priority"
                            value={formState.priority}
                            onChange={(e) =>
                                updateField(
                                    'priority',
                                    e.target.value as Priority
                                )
                            }
                            onBlur={() => handleFieldBlur('priority')}
                        >
                            {PRIORITIES.map((priority) => (
                                <option key={priority} value={priority}>
                                    {PRIORITY_LABELS[priority]}
                                </option>
                            ))}
                        </Select>
                    </FormField>
                </div>

                <FormField
                    label="Deadline"
                    id="task-deadline"
                    error={fieldErrors.deadline}
                >
                    <Input
                        id="task-deadline"
                        type="date"
                        value={formState.deadline}
                        onChange={(e) =>
                            updateField('deadline', e.target.value)
                        }
                        onBlur={() => handleFieldBlur('deadline')}
                    />
                </FormField>

                <ModalActions
                    mode={mode}
                    showDelete={showDeleteButton}
                    isSubmitting={isSubmitting}
                    isDeleting={isDeleting}
                    submitLabel={submitLabel}
                    isSubmitDisabled={isSubmitDisabled}
                    onCancel={handleClose}
                    onDelete={showDeleteButton ? handleDelete : undefined}
                />
            </form>
        </ModalOverlay>
    );
};
