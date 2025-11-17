import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTasks } from '../../../api/taskApi';
import type { TaskType } from '../../../types/Task';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import './TasksList.css';

export default function TasksList() {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Unknown error');
      });
  }, []);

  if (error) {
    return <ErrorMessage message={`Failed to load tasks: ${error}`} />;
  }

  if (tasks === null) {
    return <div className="loading">Loading...</div>;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        message="Create your first task to get started."
        action={<Link to="/tasks/create">Create Task</Link>}
      />
    );
  }

  return (
    <div className="tasks-list-container">
      <div className="tasks-list-header">
        <h2>Tasks</h2>
        <Link to="/tasks/create">Create Task</Link>
      </div>
      <ul className="tasks-list" aria-label="tasks-list">
        {tasks.map((t) => (
          <li key={t.id} className="task-item">
            <Link to={`/tasks/${t.id}`} className="task-link">
              <h3 className="task-title">{t.title}</h3>
              {t.description && <p className="task-description">{t.description}</p>}
              <p className="task-meta">
                Status: {t.status ?? 'todo'} | Priority: {t.priority ?? 'medium'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


