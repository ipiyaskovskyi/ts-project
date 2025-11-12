import { useCallback, useEffect, useState } from 'react';
import { createTask, listTasks } from '../../api/tasks';
import type { CreateTaskInput, Task } from '../../types/task';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import { TasksList } from '../../components/TasksList/TasksList';
import './TasksPage.css';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const handleCreate = useCallback(
    async (payload: CreateTaskInput) => {
      setIsSubmitting(true);
      try {
        await createTask(payload);
        await loadTasks();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create task';
        setError(message || 'Failed to create task');
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadTasks]
  );

  return (
    <section className="tasks-page">
      <div className="tasks-page__grid">
      <TaskForm onSubmit={handleCreate} submitting={isSubmitting} />
        <div className="tasks-page__list-card">
          <h2>Recent Tasks</h2>
      <TasksList tasks={tasks} isLoading={isLoading} error={error} onRetry={loadTasks} />
    </div>
      </div>
    </section>
  );
}

export default TasksPage;


