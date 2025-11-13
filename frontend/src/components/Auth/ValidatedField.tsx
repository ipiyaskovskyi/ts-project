import React from 'react';
import { Input } from '../common/Input';

interface ValidatedFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    touched?: boolean;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

export const ValidatedField: React.FC<ValidatedFieldProps> = ({
    id,
    label,
    type = 'text',
    value,
    placeholder,
    disabled = false,
    error,
    touched = false,
    onChange,
    onBlur,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="auth-field">
            <label htmlFor={id}>{label}</label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                error={!!error}
            />
            {error && touched && (
                <div className="auth-field-error">{error}</div>
            )}
        </div>
    );
};
