import React from 'react';
import { Link } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validateEmail, validatePassword } from '../../utils/validation';
import { ValidatedField } from './ValidatedField';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import './Auth.css';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    isLoading = false,
    error,
}) => {
    const { values, errors, touched, setValue, setTouched, validateAll } =
        useFormValidation(
            { email: '', password: '' },
            {
                email: (value) => validateEmail(value),
                password: (value) => validatePassword(value, 0),
            }
        );

    const isFormValid =
        !errors.email &&
        !errors.password &&
        values.email.trim() !== '' &&
        values.password !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAll()) {
            return;
        }

        await onSubmit(values.email, values.password);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Sign In</h1>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="auth-form" role="form">
                    <ValidatedField
                        id="email"
                        label="Email"
                        type="email"
                        value={values.email}
                        onChange={(value) => setValue('email', value)}
                        onBlur={() => setTouched('email')}
                        placeholder="your@email.com"
                        disabled={isLoading}
                        error={errors.email}
                        touched={!!touched.email}
                    />

                    <ValidatedField
                        id="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChange={(value) => setValue('password', value)}
                        onBlur={() => setTouched('password')}
                        placeholder="••••••••"
                        disabled={isLoading}
                        error={errors.password}
                        touched={!!touched.password}
                    />

                    <Button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading || !isFormValid}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <span>Don&apos;t have an account? </span>
                    <Link to="/register" className="auth-link">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};
