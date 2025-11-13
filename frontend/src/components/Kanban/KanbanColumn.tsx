import React from "react";
import { useDroppable } from "@dnd-kit/core";
import type { KanbanTask, KanbanStatus } from "../../types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  id: KanbanStatus;
  title: string;
  tasks: KanbanTask[];
  color?: string;
  onTaskEdit?: (task: KanbanTask) => void;
}

const statusColors: Record<KanbanStatus, string> = {
  draft: "var(--color-text-tertiary)",
  in_progress: "var(--color-status-in-progress)",
  editing: "var(--color-status-editing)",
  done: "var(--color-status-done)",
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  color,
  onTaskEdit,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const columnColor = color || statusColors[id];

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: "300px",
        backgroundColor: "transparent",
        borderRadius: "var(--radius-lg)",
        padding: "0 var(--spacing-md) var(--spacing-xl)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-sm)",
          margin: "var(--spacing-md) 0",
          padding: "var(--spacing-sm)",
          borderBottom: "2px solid var(--color-border)",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: columnColor,
          }}
        />
        <h2
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {title}
        </h2>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.75rem",
            color: "var(--color-text-tertiary)",
            backgroundColor: "var(--color-bg-tertiary)",
            padding: "0 8px",
            borderRadius: "999px",
            border: "1px solid var(--color-border)",
          }}
        >
          {tasks.length}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-sm)",
          minHeight: 100,
          border: isOver
            ? "2px dashed var(--color-status-in-progress)"
            : "2px dashed transparent",
          borderRadius: "var(--radius-md)",
          transition: "border var(--transition-fast)",
        }}
      >
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onEdit={onTaskEdit} />
        ))}
      </div>
    </div>
  );
};
