import type { Task } from '../../types/task';

function formatDeadline(deadline?: string | null): string {
  if (!deadline) {
    return 'No deadline';
  }

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatAssignee(task: Task): string {
  if (!task.assignee) {
    return 'Unassigned';
  }
  return `${task.assignee.name} (${task.assignee.email})`;
}

export interface TasksListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function TasksList({ tasks, isLoading = false, error = null, onRetry }: TasksListProps) {
  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        Loading tasks…
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div aria-live="polite" data-testid="tasks-empty">
        No tasks yet
      </div>
    );
  }

  return (
    <ul aria-label="Tasks list">
      {tasks.map((task) => (
        <li key={task.id} data-testid="task-item">
          <h3>{task.title}</h3>
          <p>{task.description ?? 'No description'}</p>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{task.status}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{task.priority}</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>{formatDeadline(task.deadline)}</dd>
            </div>
            <div>
              <dt>Assignee</dt>
              <dd>{formatAssignee(task)}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export default TasksList;


