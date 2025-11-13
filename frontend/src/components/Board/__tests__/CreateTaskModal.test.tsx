import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CreateTaskModal } from '../CreateTaskModal';
import type { TaskFormValues } from '../CreateTaskModal';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CreateTaskModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create mode', () => {
    it('should not render when isOpen is false', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={false}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
    });

    it('should render form when isOpen is true', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
      expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
      expect(screen.getAllByText('Type').length).toBeGreaterThan(0);
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Priority').length).toBeGreaterThan(0);
      expect(screen.getByLabelText(/Deadline/i)).toBeInTheDocument();
    });

    it('should have default values in create mode', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);

      expect(titleInput).toHaveValue('');

      expect(screen.getAllByText('Type').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Priority').length).toBeGreaterThan(0);

      const formControls = document.querySelectorAll('.MuiFormControl-root');
      const selectControls = Array.from(formControls).filter((control) => {
        const label = control.querySelector('label');
        return (
          label &&
          (label.textContent === 'Type' ||
            label.textContent === 'Status' ||
            label.textContent === 'Priority')
        );
      });
      expect(selectControls.length).toBe(3);
    });

    it('should disable submit button when title is empty', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      expect(submitButton).toBeDisabled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should disable submit button when title is only whitespace', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, '   ');

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      expect(submitButton).toBeDisabled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit with correct values when form is valid', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      const descriptionTextarea = screen.getByLabelText(/Description/i);

      await user.type(titleInput, 'Test Task');
      await user.type(descriptionTextarea, 'Test Description');

      const typeLabels = screen.getAllByText('Type');
      const typeLabel =
        typeLabels.find((label) => label.tagName === 'LABEL') || typeLabels[0];
      const typeFormControl = typeLabel.closest('.MuiFormControl-root');
      const typeSelectButton =
        typeFormControl?.querySelector('[role="button"]') ||
        typeFormControl?.querySelector('.MuiSelect-select') ||
        (typeFormControl?.querySelector('button') as HTMLElement);

      const statusLabels = screen.getAllByText('Status');
      const statusLabel =
        statusLabels.find((label) => label.tagName === 'LABEL') ||
        statusLabels[0];
      const statusFormControl = statusLabel.closest('.MuiFormControl-root');
      const statusSelectButton =
        statusFormControl?.querySelector('[role="button"]') ||
        statusFormControl?.querySelector('.MuiSelect-select') ||
        (statusFormControl?.querySelector('button') as HTMLElement);

      const priorityLabels = screen.getAllByText('Priority');
      const priorityLabel =
        priorityLabels.find((label) => label.tagName === 'LABEL') ||
        priorityLabels[0];
      const priorityFormControl = priorityLabel.closest('.MuiFormControl-root');
      const prioritySelectButton =
        priorityFormControl?.querySelector('[role="button"]') ||
        priorityFormControl?.querySelector('.MuiSelect-select') ||
        (priorityFormControl?.querySelector('button') as HTMLElement);

      expect(typeSelectButton).toBeTruthy();
      expect(statusSelectButton).toBeTruthy();
      expect(prioritySelectButton).toBeTruthy();

      await user.click(typeSelectButton!);
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Bug' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'Bug' }));

      await user.click(statusSelectButton!);
      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'In Progress' })
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'In Progress' }));

      await user.click(prioritySelectButton!);
      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'High' })
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'High' }));

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Task',
          description: 'Test Description',
          type: 'Bug',
          status: 'in_progress',
          priority: 'high',
          deadline: '',
        });
      });
    });

    it('should trim title and description before submitting', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      const descriptionTextarea = screen.getByLabelText(/Description/i);

      await user.type(titleInput, '  Test Task  ');
      await user.type(descriptionTextarea, '  Test Description  ');

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Task',
            description: 'Test Description',
          })
        );
      });
    });

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, 'Test Task');

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Creating...')).toBeInTheDocument();
      });

      resolveSubmit!();
      await submitPromise;
    });

    it('should disable submit button when form is empty (not valid)', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is valid and has changes', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      expect(submitButton).toBeDisabled();

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, 'Test Task');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should disable submit button when title is only whitespace', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, '   ');

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Edit mode', () => {
    const initialValues: Partial<TaskFormValues> = {
      title: 'Existing Task',
      description: 'Existing Description',
      type: 'Bug',
      status: 'in_progress',
      priority: 'high',
      deadline: '2025-12-31',
    };

    it('should render with initial values in edit mode', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          ticketId={123}
        />
      );

      expect(screen.getByText('TM-123')).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/Task Title/i);
      const descriptionTextarea = screen.getByLabelText(/Description/i);
      const deadlineInput = screen.getByLabelText(/Deadline/i);

      expect(titleInput).toHaveValue('Existing Task');
      expect(descriptionTextarea).toHaveValue('Existing Description');
      expect(deadlineInput).toHaveValue('2025-12-31');

      const formControls = document.querySelectorAll('.MuiFormControl-root');
      const selectControls = Array.from(formControls).filter((control) => {
        const label = control.querySelector('label');
        return (
          label &&
          (label.textContent === 'Type' ||
            label.textContent === 'Status' ||
            label.textContent === 'Priority')
        );
      });
      expect(selectControls.length).toBe(3);
    });

    it('should show delete button in edit mode', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(
        screen.getByRole('button', { name: /Delete/i })
      ).toBeInTheDocument();
    });

    it('should not show delete button when onDelete is not provided', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(
        screen.queryByRole('button', { name: /Delete/i })
      ).not.toBeInTheDocument();
    });

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      mockOnDelete.mockResolvedValue(undefined);

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', {
        name: /Delete/i,
      });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalled();
      });
    });

    it("should show 'Save changes' button text in edit mode", () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(
        screen.getByRole('button', { name: /Save changes/i })
      ).toBeInTheDocument();
    });

    it('should call onSubmit with updated values in edit mode', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task');

      const submitButton = screen.getByRole('button', {
        name: /Save changes/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Updated Task',
            description: 'Existing Description',
            type: 'Bug',
            status: 'in_progress',
            priority: 'high',
            deadline: '2025-12-31',
          })
        );
      });
    });

    it('should disable submit button when title is cleared in edit mode', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.clear(titleInput);

      const submitButton = screen.getByRole('button', {
        name: /Save changes/i,
      });
      expect(submitButton).toBeDisabled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should disable submit button when form has not changed in edit mode', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: /Save changes/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form has changed in edit mode', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="edit"
          initialValues={initialValues}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: /Save changes/i,
      });
      expect(submitButton).toBeDisabled();

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, ' Updated');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Form validation', () => {
    it('should disable submit button when title is empty', () => {
      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('should display error message from onSubmit when submission fails', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Failed to create task';
      mockOnSubmit.mockRejectedValue(new Error(errorMessage));

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, 'Test Task');

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should clear error when form is resubmitted with valid data', async () => {
      const user = userEvent.setup();
      mockOnSubmit
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(undefined);

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, 'Test Task');

      const submitButton = screen.getByRole('button', {
        name: /Create task/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form interactions', () => {
    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const cancelButton = screen.getByRole('button', {
        name: /Cancel/i,
      });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal when overlay is clicked', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const backdrop = document.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it('should close modal when close button (X) is clicked', async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const closeButton = screen.getByLabelText('close');
      await user.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form when modal is closed and reopened', async () => {
      const user = userEvent.setup();
      const { rerender } = renderWithRouter(
        <CreateTaskModal
          isOpen={true}
          mode="create"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const titleInput = screen.getByLabelText(/Task Title/i);
      await user.type(titleInput, 'Test Task');

      expect(titleInput).toHaveValue('Test Task');

      rerender(
        <BrowserRouter>
          <CreateTaskModal
            isOpen={false}
            mode="create"
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          />
        </BrowserRouter>
      );

      rerender(
        <BrowserRouter>
          <CreateTaskModal
            isOpen={true}
            mode="create"
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          />
        </BrowserRouter>
      );

      const newTitleInput = screen.getByLabelText(/Task Title/i);
      expect(newTitleInput).toHaveValue('');
    });
  });
});
