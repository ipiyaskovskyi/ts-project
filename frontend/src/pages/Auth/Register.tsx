import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.css";

interface FieldErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface TouchedFields {
  firstname?: boolean;
  lastname?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
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
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return undefined;
};

const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  return undefined;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
};

export const Register: React.FC = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const firstnameError = useMemo(() => {
    if (!touched.firstname) return undefined;
    return validateName(firstname, "Firstname");
  }, [firstname, touched.firstname]);

  const lastnameError = useMemo(() => {
    if (!touched.lastname) return undefined;
    return validateName(lastname, "Lastname");
  }, [lastname, touched.lastname]);

  const emailError = useMemo(() => {
    if (!touched.email) return undefined;
    return validateEmail(email);
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return undefined;
    return validatePassword(password);
  }, [password, touched.password]);

  const confirmPasswordError = useMemo(() => {
    if (!touched.confirmPassword) return undefined;
    return validateConfirmPassword(password, confirmPassword);
  }, [password, confirmPassword, touched.confirmPassword]);

  const isFormValid = useMemo(() => {
    return (
      !firstnameError &&
      !lastnameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      firstname.trim() !== "" &&
      lastname.trim() !== "" &&
      email.trim() !== "" &&
      password !== "" &&
      confirmPassword !== ""
    );
  }, [
    firstnameError,
    lastnameError,
    emailError,
    passwordError,
    confirmPasswordError,
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const firstnameErr = validateName(firstname, "Firstname");
    const lastnameErr = validateName(lastname, "Lastname");
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);

    if (firstnameErr || lastnameErr || emailErr || passwordErr || confirmPasswordErr) {
      setFieldErrors({
        firstname: firstnameErr,
        lastname: lastnameErr,
        email: emailErr,
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
      });
      return;
    }

    setFieldErrors({});

    try {
      const success = await register(email, password, firstname, lastname);
      if (success) {
        navigate("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" role="form">
          <div className="auth-field">
            <label htmlFor="firstname">Firstname</label>
            <input
              id="firstname"
              type="text"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
                if (touched.firstname) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    firstname: validateName(e.target.value, "Firstname"),
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, firstname: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  firstname: validateName(firstname, "Firstname"),
                }));
              }}
              placeholder="Your firstname"
              disabled={isLoading}
            />
            {fieldErrors.firstname && (
              <div className="auth-field-error">{fieldErrors.firstname}</div>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="lastname">Lastname</label>
            <input
              id="lastname"
              type="text"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
                if (touched.lastname) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    lastname: validateName(e.target.value, "Lastname"),
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, lastname: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  lastname: validateName(lastname, "Lastname"),
                }));
              }}
              placeholder="Your lastname"
              disabled={isLoading}
            />
            {fieldErrors.lastname && (
              <div className="auth-field-error">{fieldErrors.lastname}</div>
            )}
          </div>

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
                if (touched.confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(
                      e.target.value,
                      confirmPassword,
                    ),
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

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(
                      password,
                      e.target.value,
                    ),
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, confirmPassword: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  confirmPassword: validateConfirmPassword(password, confirmPassword),
                }));
              }}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {fieldErrors.confirmPassword && (
              <div className="auth-field-error">{fieldErrors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
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

