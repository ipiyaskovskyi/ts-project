import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import TasksList from './TasksList';

function renderWithRouter(ui: React.ReactElement) {
  const router = createMemoryRouter([
    { path: '/', element: ui },
    { path: '/tasks/create', element: <div>create</div> },
    { path: '/tasks/:id', element: <div>details</div> },
  ]);
  return render(<RouterProvider router={router} />);
}

const mockTasks = [
  { id: 1, title: 'Task A', description: 'Desc A', status: 'todo', priority: 'low' },
  { id: 2, title: 'Task B', description: 'Desc B', status: 'done', priority: 'high' },
];

describe('TasksList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders items with required fields', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockTasks,
    } as unknown as Response);

    renderWithRouter(<TasksList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText('tasks-list')).toBeInTheDocument();
    });

    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText(/Priority:/)).toBeInTheDocument();
  });

  test('shows empty state when no tasks', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => [],
    } as unknown as Response);

    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByLabelText('empty')).toBeInTheDocument();
    });
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create task/i })).toBeInTheDocument();
  });

  test('shows error message on failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('boom'));

    renderWithRouter(<TasksList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
  });
});


