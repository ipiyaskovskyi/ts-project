import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('disables submit button when form is invalid', () => {
    render(<TaskForm />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form becomes valid', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Prepare meeting agenda');
    expect(submitButton).toBeEnabled();
  });

  it('shows validation messages for invalid fields', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'ab');
    const minError = await screen.findByTestId('error-title');
    expect(minError).toHaveTextContent('Title must be at least 3 characters long');

    await user.clear(titleInput);
    const requiredError = await screen.findByTestId('error-title');
    expect(requiredError).toHaveTextContent('Title is required');

    const deadlineInput = screen.getByLabelText(/deadline/i);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formatted = yesterday.toISOString().slice(0, 10);

    await user.clear(deadlineInput);
    await user.type(deadlineInput, formatted);

    const deadlineError = await screen.findByTestId('error-deadline');
    expect(deadlineError).toHaveTextContent('Deadline cannot be in the past');
  });
});
