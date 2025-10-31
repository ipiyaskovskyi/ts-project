import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTasks } from '../api';
import type { TaskType } from '../types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

export default function TasksList() {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listTasks()
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <ErrorMessage message={`Failed to load tasks: ${error}`} />;
  }

  if (tasks === null) {
    return <div>Loading...</div>;
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Tasks</h2>
        <Link to="/tasks/create">Create Task</Link>
      </div>
      <ul aria-label="tasks-list" style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
            <Link to={`/tasks/${t.id}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ margin: '0 0 8px' }}>{t.title}</h3>
              {t.description && <p style={{ margin: 0 }}>{t.description}</p>}
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#555' }}>
                Status: {t.status ?? 'todo'} | Priority: {t.priority ?? 'medium'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


