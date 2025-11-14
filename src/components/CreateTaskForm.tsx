import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../schemas/taskSchema';
import { createTask } from '../api/taskApi';
import './CreateTaskForm.css';


const CreateTaskForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask(data);
      reset();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="create-task-form-container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="create-task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title"
          />
          {errors.title && (
            <span className="error-message">{errors.title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter task description"
            rows={3}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status *
            </label>
            <select
              id="status"
              {...register('status')}
              className={`form-select ${errors.status ? 'error' : ''}`}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            {errors.status && (
              <span className="error-message">{errors.status.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority *
            </label>
            <select
              id="priority"
              {...register('priority')}
              className={`form-select ${errors.priority ? 'error' : ''}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <span className="error-message">{errors.priority.message}</span>
            )}
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
            className={`form-input ${errors.deadline ? 'error' : ''}`}
          />
          {errors.deadline && (
            <span className="error-message">{errors.deadline.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!isValid}
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;
