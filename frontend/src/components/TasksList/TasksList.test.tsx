import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Task } from '../../types/task';
import { TasksList } from './TasksList';

function createTask(partial: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Task title',
    description: 'Task description',
    status: 'todo',
    priority: 'medium',
    deadline: '2025-01-01T10:00:00.000Z',
    assignee: {
      id: 10,
      name: 'Jane Doe',
      email: 'jane@example.com'
    },
    createdAt: '2024-12-31T12:00:00.000Z',
    ...partial
  };
}

describe('TasksList', () => {
  it('renders task items with all required fields', () => {
    const tasks: Task[] = [
      createTask(),
      createTask({
        id: 2,
        title: 'Second task',
        description: null,
        status: 'done',
        priority: 'high',
        deadline: null,
        assignee: null
      })
    ];

    render(<TasksList tasks={tasks} />);

    expect(screen.getAllByTestId('task-item')).toHaveLength(2);
    expect(screen.getByText('Task title')).toBeInTheDocument();
    expect(screen.getByText('Task description')).toBeInTheDocument();
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Priority/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Assignee/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Second task/)).toBeInTheDocument();
    expect(screen.getByText('No description')).toBeInTheDocument();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<TasksList tasks={[]} />);
    expect(screen.getByTestId('tasks-empty')).toHaveTextContent('No tasks yet');
  });

  it('renders error message and handles retry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<TasksList tasks={[]} error="Something went wrong" onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});


