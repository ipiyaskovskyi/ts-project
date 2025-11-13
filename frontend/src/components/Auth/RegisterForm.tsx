import React from 'react';
import { Link } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
    validateEmail,
    validatePassword,
    validateName,
    validateConfirmPassword,
} from '../../utils/validation';
import { ValidatedField } from './ValidatedField';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import './Auth.css';

interface RegisterFormProps {
    onSubmit: (
        email: string,
        password: string,
        firstname: string,
        lastname: string
    ) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    isLoading = false,
    error,
}) => {
    const { values, errors, touched, setValue, setTouched, validateAll } =
        useFormValidation(
            {
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            {
                firstname: (value) => validateName(value, 'Firstname'),
                lastname: (value) => validateName(value, 'Lastname'),
                email: (value) => validateEmail(value),
                password: (value) => validatePassword(value, 6),
                confirmPassword: (value, allValues) => {
                    if (!allValues) return 'Please confirm your password';
                    return validateConfirmPassword(allValues.password, value);
                },
            }
        );

    const isFormValid =
        !errors.firstname &&
        !errors.lastname &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword &&
        values.firstname.trim() !== '' &&
        values.lastname.trim() !== '' &&
        values.email.trim() !== '' &&
        values.password !== '' &&
        values.confirmPassword !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAll()) {
            return;
        }

        await onSubmit(
            values.email,
            values.password,
            values.firstname,
            values.lastname
        );
    };

    const handlePasswordChange = (value: string) => {
        setValue('password', value);
        if (touched.confirmPassword) {
            setTouched('confirmPassword');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Sign Up</h1>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="auth-form" role="form">
                    <ValidatedField
                        id="firstname"
                        label="Firstname"
                        type="text"
                        value={values.firstname}
                        onChange={(value) => setValue('firstname', value)}
                        onBlur={() => setTouched('firstname')}
                        placeholder="Your firstname"
                        disabled={isLoading}
                        error={errors.firstname}
                        touched={!!touched.firstname}
                    />

                    <ValidatedField
                        id="lastname"
                        label="Lastname"
                        type="text"
                        value={values.lastname}
                        onChange={(value) => setValue('lastname', value)}
                        onBlur={() => setTouched('lastname')}
                        placeholder="Your lastname"
                        disabled={isLoading}
                        error={errors.lastname}
                        touched={!!touched.lastname}
                    />

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
                        onChange={handlePasswordChange}
                        onBlur={() => setTouched('password')}
                        placeholder="••••••••"
                        disabled={isLoading}
                        error={errors.password}
                        touched={!!touched.password}
                    />

                    <ValidatedField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={values.confirmPassword}
                        onChange={(value) => setValue('confirmPassword', value)}
                        onBlur={() => setTouched('confirmPassword')}
                        placeholder="••••••••"
                        disabled={isLoading}
                        error={errors.confirmPassword}
                        touched={!!touched.confirmPassword}
                    />

                    <Button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading || !isFormValid}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account? </span>
                    <Link to="/login" className="auth-link">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};
