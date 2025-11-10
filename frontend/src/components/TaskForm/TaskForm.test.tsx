import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('disables submit button when form is empty or invalid', () => {
    render(<TaskForm />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form becomes valid', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(titleInput, 'Prepare meeting agenda');
    expect(submitButton).toBeEnabled();
  });

  it('shows validation messages when submitting invalid data', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.click(titleInput);
    await user.tab();
    const titleError = await screen.findByTestId('error-title');
    expect(titleError).toHaveTextContent('Title is required');

    const deadlineInput = screen.getByLabelText(/deadline/i);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formatted = yesterday.toISOString().slice(0, 10);

    await user.clear(deadlineInput);
    await user.type(deadlineInput, formatted);
    await user.tab();

    const deadlineError = await screen.findByTestId('error-deadline');
    expect(deadlineError).toHaveTextContent('Deadline must be in the future');
  });
});


