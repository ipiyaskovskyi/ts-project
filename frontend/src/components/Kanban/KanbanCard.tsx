import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { FiEdit2 } from "react-icons/fi";
import type { KanbanTask } from "../../types";

interface KanbanCardProps {
  task: KanbanTask;
  onEdit?: (task: KanbanTask) => void;
}

const priorityColor: Record<KanbanTask["priority"], string> = {
  low: "#97a0af",
  medium: "#0052cc",
  high: "#ff5630",
  urgent: "#ff5630",
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md)",
        border: "1px solid var(--color-border)",
        boxShadow: isDragging ? "var(--shadow-md)" : "var(--shadow-sm)",
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging
          ? "none"
          : "box-shadow var(--transition-fast), transform var(--transition-fast)",
        opacity: isDragging ? 0.7 : 1,
        ...style,
      }}
      {...listeners}
      {...attributes}
      onMouseEnter={(e) => {
        if (!isDragging) e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        if (!isDragging) e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            margin: 0,
            color: "var(--color-text-primary)",
          }}
        >
          {task.title}
        </h3>
        <div style={{ display: "flex", gap: 6 }}>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--color-text-secondary)",
              backgroundColor: "var(--color-bg-tertiary)",
              border: "1px solid var(--color-border)",
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {task.type ?? "Task"}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "#fff",
              backgroundColor: priorityColor[task.priority],
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {task.priority.toUpperCase()}
          </span>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              onEdit(task);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-secondary)",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            <FiEdit2 size={14} />
            Edit
          </button>
        )}
      </div>

      {task.description && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-secondary)",
            marginBottom: "8px",
          }}
        >
          {task.description}
        </p>
      )}

      {task.comments !== undefined || task.files !== undefined ? (
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-sm)",
            fontSize: "0.75rem",
            color: "var(--color-text-secondary)",
            marginTop: "var(--spacing-sm)",
          }}
        >
          {typeof task.comments === "number" && (
            <span>Comments: {task.comments}</span>
          )}
          {typeof task.files === "number" && <span>Files: {task.files}</span>}
        </div>
      ) : null}
    </div>
  );
};
