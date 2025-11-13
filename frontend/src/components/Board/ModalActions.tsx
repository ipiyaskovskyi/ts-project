import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Button } from '../common/Button';

interface ModalActionsProps {
    mode: 'create' | 'edit';
    showDelete: boolean;
    isSubmitting: boolean;
    isDeleting: boolean;
    submitLabel: string;
    isSubmitDisabled: boolean;
    onCancel: () => void;
    onDelete?: () => void;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
    showDelete,
    isSubmitting,
    isDeleting,
    submitLabel,
    isSubmitDisabled,
    onCancel,
    onDelete,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}
        >
            {showDelete ? (
                <Button
                    type="button"
                    variant="danger"
                    onClick={onDelete}
                    isLoading={isDeleting}
                    disabled={isSubmitting}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                        }}
                    >
                        <FiTrash2 size={16} />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </div>
                </Button>
            ) : (
                <span />
            )}

            <div
                style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                }}
            >
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting || isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitDisabled}
                >
                    {submitLabel}
                </Button>
            </div>
        </div>
    );
};
