import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from '../../utils/validation';

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
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                id="firstname"
                label="Firstname"
                type="text"
                value={values.firstname}
                onChange={(e) => setValue('firstname', e.target.value)}
                onBlur={() => setTouched('firstname')}
                placeholder="Your firstname"
                disabled={isLoading}
                error={!!errors.firstname && !!touched.firstname}
                helperText={touched.firstname ? errors.firstname : ''}
                fullWidth
                required
              />

              <TextField
                id="lastname"
                label="Lastname"
                type="text"
                value={values.lastname}
                onChange={(e) => setValue('lastname', e.target.value)}
                onBlur={() => setTouched('lastname')}
                placeholder="Your lastname"
                disabled={isLoading}
                error={!!errors.lastname && !!touched.lastname}
                helperText={touched.lastname ? errors.lastname : ''}
                fullWidth
                required
              />

              <TextField
                id="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                onBlur={() => setTouched('email')}
                placeholder="your@email.com"
                disabled={isLoading}
                error={!!errors.email && !!touched.email}
                helperText={touched.email ? errors.email : ''}
                fullWidth
                required
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                value={values.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => setTouched('password')}
                placeholder="••••••••"
                disabled={isLoading}
                error={!!errors.password && !!touched.password}
                helperText={touched.password ? errors.password : ''}
                fullWidth
                required
              />

              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={values.confirmPassword}
                onChange={(e) => setValue('confirmPassword', e.target.value)}
                onBlur={() => setTouched('confirmPassword')}
                placeholder="••••••••"
                disabled={isLoading}
                error={!!errors.confirmPassword && !!touched.confirmPassword}
                helperText={
                  touched.confirmPassword ? errors.confirmPassword : ''
                }
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || !isFormValid}
                sx={{ mt: 1 }}
              >
                {isLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={16} color="inherit" />
                    <span>Signing up...</span>
                  </Box>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
