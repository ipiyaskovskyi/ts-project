import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../LoginForm';

const mockLogin = vi.fn();
const mockUseAuth = vi.fn(() => ({
    login: mockLogin,
    isLoading: false,
    user: null,
}));

vi.mock('../../../contexts/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginForm', () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
        mockLogin.mockResolvedValue(true);
    });

    it('should render login form', () => {
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        expect(
            screen.getByRole('heading', { name: /Sign In/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /^Sign In$/i })
        ).toBeInTheDocument();
    });

    it('should disable submit button when form is empty', () => {
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /Sign In/i });
        expect(submitButton).toBeDisabled();
    });

    it('should show email error when email is invalid', async () => {
        const user = userEvent.setup();
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/Email/i);
        await user.type(emailInput, 'invalid-email');
        await user.tab();

        await waitFor(() => {
            expect(
                screen.getByText('Please enter a valid email address')
            ).toBeInTheDocument();
        });
    });

    it('should show email error when email is empty after blur', async () => {
        const user = userEvent.setup();
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/Email/i);
        await user.click(emailInput);
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });

    it('should show password error when password is empty after blur', async () => {
        const user = userEvent.setup();
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^Password$/i);
        await user.click(passwordInput);
        await user.tab();

        await waitFor(() => {
            expect(
                screen.getByText('Password is required')
            ).toBeInTheDocument();
        });
    });

    it('should enable submit button when form is valid', async () => {
        const user = userEvent.setup();
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/^Password$/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /Sign In/i });
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('should not show errors before fields are touched', () => {
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Password is required')
        ).not.toBeInTheDocument();
    });

    it('should clear email error when email becomes valid', async () => {
        const user = userEvent.setup();
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/Email/i);
        await user.type(emailInput, 'invalid');
        await user.tab();

        await waitFor(() => {
            expect(
                screen.getByText('Please enter a valid email address')
            ).toBeInTheDocument();
        });

        await user.clear(emailInput);
        await user.type(emailInput, 'test@example.com');

        await waitFor(() => {
            expect(
                screen.queryByText('Please enter a valid email address')
            ).not.toBeInTheDocument();
        });
    });

    it('should show all errors when form is submitted with invalid data', async () => {
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const form = screen.getByRole('form') || document.querySelector('form');
        if (form) {
            fireEvent.submit(form);
        }

        await waitFor(
            () => {
                expect(
                    screen.getByText('Email is required')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Password is required')
                ).toBeInTheDocument();
            },
            { timeout: 2000 }
        );
    });

    it('should trim email before validation', async () => {
        const user = userEvent.setup();
        renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/Email/i);
        await user.type(emailInput, '  test@example.com  ');
        await user.tab();

        await waitFor(() => {
            expect(
                screen.queryByText('Please enter a valid email address')
            ).not.toBeInTheDocument();
        });
    });
});
