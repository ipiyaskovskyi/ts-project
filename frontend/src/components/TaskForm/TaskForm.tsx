import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateTaskInput } from '../../types/task';
import { taskSchema, type TaskFormValues } from '../../schemas/taskSchema';
import './TaskForm.css';

export interface TaskFormProps {
  onSubmit?: (payload: CreateTaskInput) => Promise<void> | void;
  submitting?: boolean;
}

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  deadline: ''
};

export function TaskForm({ onSubmit, submitting = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: 'onChange',
    defaultValues
  });

  const onFormSubmit = async (data: TaskFormValues) => {
    const payload: CreateTaskInput = {
      title: data.title.trim(),
      description: data.description?.trim() ? data.description.trim() : null,
      status: data.status,
      priority: data.priority,
      deadline: data.deadline ? data.deadline : null
    };

    await onSubmit?.(payload);
    reset(defaultValues);
  };

  const isSubmitDisabled = submitting || isSubmitting || !isValid;
  const buttonLabel = submitting || isSubmitting ? 'Creating...' : 'Create Task';

  return (
    <div className="create-task-form-container">
      <h2>Create New Task</h2>
      <form className="create-task-form" onSubmit={handleSubmit(onFormSubmit)} aria-label="Create task form" noValidate>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
        <input
            id="title"
            type="text"
            {...register('title')}
            className={`form-input${errors.title ? ' error' : ''}`}
            placeholder="Enter task title"
            aria-invalid={errors.title ? 'true' : 'false'}
        />
          {errors.title ? (
            <span className="error-message" role="alert" data-testid="error-title">
              {errors.title.message}
            </span>
        ) : null}
      </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
        <textarea
            id="description"
            rows={3}
            {...register('description')}
            className={`form-textarea${errors.description ? ' error' : ''}`}
            placeholder="Enter task description"
          />
          {errors.description ? (
            <span className="error-message" role="alert">
              {errors.description.message}
            </span>
          ) : null}
      </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status *
            </label>
            <select
              id="status"
              {...register('status')}
              className={`form-select${errors.status ? ' error' : ''}`}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
        </select>
            {errors.status ? (
              <span className="error-message" role="alert">
                {errors.status.message}
              </span>
            ) : null}
      </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority *
            </label>
            <select
              id="priority"
              {...register('priority')}
              className={`form-select${errors.priority ? ' error' : ''}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
        </select>
            {errors.priority ? (
              <span className="error-message" role="alert">
                {errors.priority.message}
              </span>
            ) : null}
          </div>
      </div>

        <div className="form-group">
          <label htmlFor="deadline" className="form-label">
            Deadline
          </label>
        <input
            id="deadline"
          type="date"
            {...register('deadline')}
            className={`form-input${errors.deadline ? ' error' : ''}`}
            aria-invalid={errors.deadline ? 'true' : 'false'}
        />
          {errors.deadline ? (
            <span className="error-message" role="alert" data-testid="error-deadline">
              {errors.deadline.message}
            </span>
        ) : null}
      </div>

        <button type="submit" className="submit-button" disabled={isSubmitDisabled}>
          {buttonLabel}
      </button>
    </form>
    </div>
  );
}

export default TaskForm;


