import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../schemas/taskSchema';
import { createTask } from '../api/taskApi';
import './CreateTaskForm.css';


const CreateTaskForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage(null);
      setSuccessMessage(null);
      await createTask(data);
      setSuccessMessage('Task created successfully!');
      reset();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMessage('Failed to create task. Please try again.');
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div className="create-task-form-container">
      <h2>Create New Task</h2>
      {successMessage && (
        <div className="message message-success">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="message message-error">
          {errorMessage}
        </div>
      )}
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
