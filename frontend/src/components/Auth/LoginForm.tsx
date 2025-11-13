import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

interface FieldErrors {
  email?: string;
  password?: string;
}

interface TouchedFields {
  email?: boolean;
  password?: boolean;
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  return undefined;
};

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const emailError = useMemo(() => {
    if (!touched.email) return undefined;
    return validateEmail(email);
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return undefined;
    return validatePassword(password);
  }, [password, touched.password]);

  const isFormValid = useMemo(() => {
    return (
      !emailError && !passwordError && email.trim() !== "" && password !== ""
    );
  }, [emailError, passwordError, email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setFieldErrors({
        email: emailErr,
        password: passwordErr,
      });
      return;
    }

    setFieldErrors({});
    await onSubmit(email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" role="form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    email: validateEmail(e.target.value),
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  email: validateEmail(email),
                }));
              }}
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <div className="auth-field-error">{fieldErrors.email}</div>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: validatePassword(e.target.value),
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  password: validatePassword(password),
                }));
              }}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {fieldErrors.password && (
              <div className="auth-field-error">{fieldErrors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
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
