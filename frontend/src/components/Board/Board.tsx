import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Task, Status } from "../../types";
import { Column } from "./Column";
import { Card } from "./Card";

interface BoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: number, newStatus: Status) => void;
  onTaskEdit?: (task: Task) => void;
}

export const Board: React.FC<BoardProps> = ({
  tasks,
  onTaskMove,
  onTaskEdit,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns: { id: Status; title: string }[] = [
    { id: "draft", title: "Draft" },
    { id: "in_progress", title: "In Progress" },
    { id: "editing", title: "Editing" },
    { id: "done", title: "Done" },
  ];

  const tasksByStatus = columns.reduce(
    (acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    },
    {} as Record<Status, Task[]>
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = Number(active.id);
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = Number(active.id);
    if (Number.isNaN(taskId)) {
      setActiveTask(null);
      return;
    }
    const newStatus = over.id as Status;

    if (columns.some((col) => col.id === newStatus)) {
      if (onTaskMove) {
        onTaskMove(taskId, newStatus);
      }
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-lg)",
          overflowX: "auto",
          padding: "var(--spacing-md) 0",
        }}
      >
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id] || []}
            onTaskEdit={onTaskEdit}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              opacity: 0.8,
              transform: "rotate(5deg)",
            }}
          >
            <Card task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
