import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { login, verify2FA } from '../../store/slices/authSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const twoFAValidationSchema = Yup.object({
  token: Yup.string()
    .length(6, 'Token must be exactly 6 digits')
    .matches(/^\d+$/, 'Token must contain only digits')
    .required('Token is required')
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, requires2FA } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  const handleLogin = async (values, { setSubmitting }) => {
    setEmail(values.email);
    await dispatch(login(values));
    setSubmitting(false);
  };

  const handle2FAVerification = async (values, { setSubmitting }) => {
    const result = await dispatch(verify2FA({ email, token: values.token }));
    if (result.payload?.success) {
      navigate('/dashboard');
    }
    setSubmitting(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>

          {!requires2FA ? (
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form style={{ width: '100%', marginTop: '1rem' }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    margin="normal"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sign In'}
                  </Button>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Typography color="primary" variant="body2">
                        Don't have an account? Sign Up
                      </Typography>
                    </Link>
                  </Box>
                </Form>
              )}
            </Formik>
          ) : (
            <Dialog open={requires2FA} fullWidth maxWidth="xs">
              <DialogTitle>Two-Factor Authentication</DialogTitle>
              <Formik
                initialValues={{ token: '' }}
                validationSchema={twoFAValidationSchema}
                onSubmit={handle2FAVerification}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                  <Form>
                    <DialogContent>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Please enter the 6-digit code from your authenticator app.
                      </Typography>
                      <TextField
                        fullWidth
                        id="token"
                        name="token"
                        label="Authentication Code"
                        value={values.token}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.token && Boolean(errors.token)}
                        helperText={touched.token && errors.token}
                        margin="normal"
                        autoComplete="off"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Verify'}
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </Dialog>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;