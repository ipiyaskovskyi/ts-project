import type { ChangeEvent, FormEvent } from 'react';
import { useMemo, useState } from 'react';
import type { CreateTaskInput, Priority, Status } from '../../types/task';

const STATUSES: Status[] = ['todo', 'in-progress', 'done'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export interface TaskFormProps {
  onSubmit?: (payload: CreateTaskInput) => Promise<void> | void;
  submitting?: boolean;
}

type FieldName = 'title' | 'deadline';

interface ValidationErrors {
  title?: string;
  deadline?: string;
}

interface TaskFormState {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string;
}

const initialState: TaskFormState = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  deadline: ''
};

export function TaskForm({ onSubmit, submitting = false }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormState>(initialState);
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    title: false,
    deadline: false
  });

  const errors: ValidationErrors = useMemo(() => {
    const nextErrors: ValidationErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = 'Title is required';
    }

    if (form.deadline) {
      const deadlineDate = new Date(form.deadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (Number.isNaN(deadlineDate.getTime()) || deadlineDate < now) {
        nextErrors.deadline = 'Deadline must be in the future';
      }
    }

    return nextErrors;
  }, [form.title, form.deadline]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleChange = (field: keyof TaskFormState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: FieldName) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ title: true, deadline: true });

    if (!isValid) {
      return;
    }

    const payload: CreateTaskInput = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      deadline: form.deadline || null
    };

    await onSubmit?.(payload);
    setForm(initialState);
    setTouched({ title: false, deadline: false });
  };

  const isSubmitDisabled = submitting || !isValid;

  return (
    <form onSubmit={handleSubmit} aria-label="Create task form">
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          name="title"
          value={form.title}
          onChange={handleChange('title')}
          onBlur={handleBlur('title')}
          required
          aria-invalid={Boolean(errors.title && touched.title)}
        />
        {errors.title && touched.title ? (
          <p role="alert" data-testid="error-title">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange('description')}
        />
      </div>

      <div>
        <label htmlFor="task-status">Status</label>
        <select id="task-status" name="status" value={form.status} onChange={handleChange('status')}>
          {STATUSES.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select id="task-priority" name="priority" value={form.priority} onChange={handleChange('priority')}>
          {PRIORITIES.map((priorityOption) => (
            <option key={priorityOption} value={priorityOption}>
              {priorityOption}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-deadline">Deadline</label>
        <input
          id="task-deadline"
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange('deadline')}
          onBlur={handleBlur('deadline')}
          aria-invalid={Boolean(errors.deadline && touched.deadline)}
        />
        {errors.deadline && touched.deadline ? (
          <p role="alert" data-testid="error-deadline">
            {errors.deadline}
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={isSubmitDisabled}>
        Submit
      </button>
    </form>
  );
}

export default TaskForm;


