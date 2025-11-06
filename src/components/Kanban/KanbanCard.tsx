import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FiMessageCircle, FiPaperclip, FiStar, FiCheck } from 'react-icons/fi';
import type { KanbanTask } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface KanbanCardProps {
  task: KanbanTask;
}

const priorityColor: Record<NonNullable<KanbanTask['priority']>, string> = {
  LOW: '#97a0af',
  MEDIUM: '#0052cc',
  HIGH: '#ff5630',
  URGENT: '#ff5630',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        border: '1px solid var(--color-border)',
        boxShadow: isDragging ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'box-shadow var(--transition-fast), transform var(--transition-fast)',
        opacity: isDragging ? 0.7 : 1,
        ...style,
      }}
      {...listeners}
      {...attributes}
      onMouseEnter={(e) => {
        if (!isDragging) e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        if (!isDragging) e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>{task.title}</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              borderRadius: 999,
              padding: '2px 8px',
            }}
          >
            {task.type}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: '#fff',
              backgroundColor: priorityColor[task.priority],
              borderRadius: 999,
              padding: '2px 8px',
            }}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{task.description}</p>
      )}

      {task.status === 'DRAFT' && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          {task.subtasks.map((subtask) => (
            <label
              key={subtask.id}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 6, fontSize: '0.82rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <input type="checkbox" checked={subtask.completed} onChange={() => {}} style={{ cursor: 'pointer' }} />
              <span>{subtask.label && `${subtask.label}: `}{subtask.title}</span>
            </label>
          ))}
        </div>
      )}

      {task.status === 'IN_PROGRESS' && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          {task.subtasks.map((subtask) => (
            <label
              key={subtask.id}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 6, fontSize: '0.82rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <input type="checkbox" checked={subtask.completed} onChange={() => {}} style={{ cursor: 'pointer' }} />
              <span>{subtask.label && `${subtask.label}: `}{subtask.title}</span>
            </label>
          ))}
          {task.progress !== undefined && (
            <div style={{ marginTop: 6 }}>
              <ProgressBar progress={task.progress} showLabel />
            </div>
          )}
        </div>
      )}

      {task.status === 'DONE' && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          {task.subtasks.map((subtask) => (
            <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 6, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              <FiCheck size={16} style={{ color: 'var(--color-status-done)', flexShrink: 0 }} />
              <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>{subtask.label && `${subtask.label}: `}{subtask.title}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', paddingTop: 6, borderTop: '1px solid var(--color-border)' }}>
        {task.comments > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            <FiMessageCircle size={14} />
            <span>{task.comments}</span>
          </div>
        )}
        {task.files > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            <FiPaperclip size={14} />
            <span>{task.files}</span>
          </div>
        )}
        {task.stars > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            <FiStar size={14} style={{ color: '#FFAB00' }} />
            <span>{task.stars}</span>
          </div>
        )}
      </div>
    </div>
  );
};
