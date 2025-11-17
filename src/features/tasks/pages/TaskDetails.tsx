import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTask } from '../../../api/taskApi';
import type { TaskType } from '../../../types/Task';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { formatDate, formatDateShort } from '../../../shared/utils/formatDate';
import './TaskDetails.css';

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
    getTask(id)
      .then((t) => {
        setTask(t);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Unknown error');
      });
  }, [id]);

  if (error) {
    return <ErrorMessage message={`Failed to load task: ${error}`} />;
  }
  if (task === null) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="task-details-container">
      <Link to="/tasks" className="back-link">Back</Link>
      <h2 className="task-details-title">{task.title}</h2>
      {task.description && <p className="task-details-info">{task.description}</p>}
      <p className="task-details-info">
        <strong>Status:</strong> {task.status ?? 'todo'}
      </p>
      <p className="task-details-info">
        <strong>Priority:</strong> {task.priority ?? 'medium'}
      </p>
      {task.deadline && (
        <p className="task-details-info">
          <strong>Deadline:</strong> {formatDateShort(task.deadline)}
        </p>
      )}
      {task.createdAt && (
        <p className="task-details-info">
          <strong>Created:</strong> {formatDate(task.createdAt)}
        </p>
      )}
    </div>
  );
}


