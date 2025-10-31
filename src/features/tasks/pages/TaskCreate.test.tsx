import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import TaskCreate from './TaskCreate';

function renderRoute() {
  const router = createMemoryRouter([
    { path: '/', element: <TaskCreate /> },
    { path: '/tasks', element: <div>list</div> },
  ]);
  return render(<RouterProvider router={router} />);
}

describe('TaskCreate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Submit is disabled when form is invalid/empty, enabled when valid', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ id: 1 }),
    } as unknown as Response);

    const user = userEvent.setup();
    renderRoute();

    const submit = await screen.findByRole('button', { name: /create task/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/title/i), 'Valid title');
    await user.selectOptions(screen.getByLabelText(/status/i), 'todo');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'medium');

    expect(submit).toBeEnabled();
  });

  test('Shows validation error messages', async () => {
    const user = userEvent.setup();
    renderRoute();

    const title = await screen.findByLabelText(/title/i);
    await user.click(title);
    await user.tab();

    expect(await screen.findByText(/title is required|at least 3 characters/i)).toBeInTheDocument();
  });
});


