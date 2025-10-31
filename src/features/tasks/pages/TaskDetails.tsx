import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTask } from '../api';
import type { TaskType } from '../types';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

export default function TaskDetails() {
  const params = useParams();
  const id = Number(params.id);
  const [task, setTask] = useState<TaskType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError('Invalid task id');
      return;
    }
    let cancelled = false;
    getTask(id)
      .then((t) => {
        if (!cancelled) setTask(t);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return <ErrorMessage message={`Failed to load task: ${error}`} />;
  }
  if (task === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/tasks">Back</Link>
      <h2 style={{ marginTop: 12 }}>{task.title}</h2>
      {task.description && <p>{task.description}</p>}
      <p>
        <strong>Status:</strong> {task.status ?? 'todo'}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority ?? 'medium'}
      </p>
      {task.deadline && (
        <p>
          <strong>Deadline:</strong> {String(task.deadline)}
        </p>
      )}
      {task.createdAt && (
        <p>
          <strong>Created:</strong> {String(task.createdAt)}
        </p>
      )}
    </div>
  );
}


