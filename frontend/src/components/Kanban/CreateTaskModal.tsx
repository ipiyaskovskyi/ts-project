import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiX } from "react-icons/fi";
import type { KanbanStatus, Priority, TaskType } from "../../types";

export interface TaskFormValues {
  title: string;
  description: string;
  type: TaskType;
  status: KanbanStatus;
  priority: Priority;
  deadline: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<TaskFormValues>;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  ticketId?: number | null;
}

const DEFAULT_VALUES: TaskFormValues = {
  title: "",
  description: "",
  type: "Task",
  status: "draft",
  priority: "medium",
  deadline: "",
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
    [initialValues],
  );

  const [title, setTitle] = useState(mergedInitialValues.title);
  const [description, setDescription] = useState(
    mergedInitialValues.description,
  );
  const [type, setType] = useState<TaskType>(mergedInitialValues.type);
  const [status, setStatus] = useState<KanbanStatus>(
    mergedInitialValues.status,
  );
  const [priority, setPriority] = useState<Priority>(
    mergedInitialValues.priority,
  );
  const [deadline, setDeadline] = useState(mergedInitialValues.deadline);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetFormState = useCallback(() => {
    setTitle(mergedInitialValues.title);
    setDescription(mergedInitialValues.description);
    setType(mergedInitialValues.type);
    setStatus(mergedInitialValues.status);
    setPriority(mergedInitialValues.priority);
    setDeadline(mergedInitialValues.deadline);
    setError("");
    setIsSubmitting(false);
    setIsDeleting(false);
  }, [mergedInitialValues]);

  const handleClose = useCallback(() => {
    resetFormState();
    onClose();
  }, [onClose, resetFormState]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter task title");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        type,
        status,
        priority,
        deadline,
      });
      handleClose();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting the task",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    setError("");
    try {
      setIsDeleting(true);
      await onDelete();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to delete the task",
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
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isOpen, resetFormState]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const submitLabel =
    mode === "edit"
      ? isSubmitting
        ? "Saving..."
        : "Save changes"
      : isSubmitting
        ? "Creating..."
        : "Create task";
  const heading = mode === "edit" ? "Edit Task" : "Create New Task";
  const ticketLink =
    mode === "edit" && ticketId != null
      ? {
          label: `TM-${ticketId}`,
          href: `/tickets/${ticketId}`,
        }
      : null;
  const showDeleteButton = mode === "edit" && typeof onDelete === "function";

  return (
    <div
      role="presentation"
      onMouseDown={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "var(--spacing-lg)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--spacing-xl)",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--color-border)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {heading}
            </h2>
            {ticketLink && (
              <Link
                to={ticketLink.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "4px",
                  fontSize: "0.85rem",
                  color: "var(--color-status-in-progress)",
                  textDecoration: "none",
                }}
              >
                {ticketLink.label}
              </Link>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "var(--radius-md)",
              color: "var(--color-text-secondary)",
              transition: "background var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--color-bg-tertiary)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "var(--radius-md)",
                color: "#dc2626",
                fontSize: "0.875rem",
                marginBottom: "var(--spacing-md)",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label
              htmlFor="task-title"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--color-text-primary)",
                marginBottom: "var(--spacing-xs)",
              }}
            >
              Task Title <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                transition: "border-color var(--transition-fast)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-status-in-progress)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label
              htmlFor="task-type"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--color-text-primary)",
                marginBottom: "var(--spacing-xs)",
              }}
            >
              Type
            </label>
            <select
              id="task-type"
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                transition: "border-color var(--transition-fast)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-status-in-progress)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <option value="Task">Task</option>
              <option value="Subtask">Subtask</option>
              <option value="Bug">Bug</option>
              <option value="Story">Story</option>
              <option value="Epic">Epic</option>
            </select>
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label
              htmlFor="task-description"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--color-text-primary)",
                marginBottom: "var(--spacing-xs)",
              }}
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                transition: "border-color var(--transition-fast)",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-status-in-progress)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--spacing-md)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <div>
              <label
                htmlFor="task-status"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as KanbanStatus)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  backgroundColor: "var(--color-bg-primary)",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  transition: "border-color var(--transition-fast)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-status-in-progress)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="editing">Editing</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  backgroundColor: "var(--color-bg-primary)",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  transition: "border-color var(--transition-fast)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-status-in-progress)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <label
              htmlFor="task-deadline"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--color-text-primary)",
                marginBottom: "var(--spacing-xs)",
              }}
            >
              Deadline
            </label>
            <input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                transition: "border-color var(--transition-fast)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-status-in-progress)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--spacing-md)",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {showDeleteButton ? (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #dc2626",
                  backgroundColor: isDeleting ? "#fee2e2" : "transparent",
                  color: "#dc2626",
                  cursor:
                    isDeleting || isSubmitting ? "not-allowed" : "pointer",
                  opacity: isDeleting || isSubmitting ? 0.7 : 1,
                  transition: "all var(--transition-fast)",
                }}
                disabled={isDeleting || isSubmitting}
              >
                <FiTrash2 size={16} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            ) : (
              <span />
            )}

            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-bg-primary)",
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor:
                    isSubmitting || isDeleting ? "not-allowed" : "pointer",
                  transition: "all var(--transition-fast)",
                  opacity: isSubmitting || isDeleting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (isSubmitting || isDeleting) {
                    return;
                  }
                  e.currentTarget.style.borderColor =
                    "var(--color-text-secondary)";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-status-in-progress)",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor:
                    isSubmitting || isDeleting ? "not-allowed" : "pointer",
                  transition: "background-color var(--transition-fast)",
                  opacity: isSubmitting || isDeleting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (isSubmitting || isDeleting) {
                    return;
                  }
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-status-in-progress)";
                }}
                disabled={isSubmitting || isDeleting}
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
