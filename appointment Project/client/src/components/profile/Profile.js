import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { setup2FA, enable2FA } from '../../store/slices/authSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  currentPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setupError, setSetupError] = useState('');

  const handleProfileUpdate = async (values, { setSubmitting }) => {
    // TODO: Implement profile update
    setSubmitting(false);
  };

  const handleSetup2FA = async () => {
    setSetupError('');
    const result = await dispatch(setup2FA());
    if (result.payload?.success) {
      setQRCodeData(result.payload.qrCode);
      setShowQRCode(true);
    }
  };

  const handleVerify2FA = async () => {
    setSetupError('');
    const result = await dispatch(enable2FA({ token: verificationCode }));
    if (result.payload?.success) {
      setShowQRCode(false);
      setVerificationCode('');
    } else {
      setSetupError('Invalid verification code');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Two-Factor Authentication
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {user?.twoFactorEnabled
              ? 'Two-factor authentication is enabled for your account.'
              : 'Enhance your account security by enabling two-factor authentication.'}
          </Typography>
          {!user?.twoFactorEnabled && (
            <Button
              variant="contained"
              onClick={handleSetup2FA}
              disabled={loading}
            >
              Setup 2FA
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>

        <Formik
          initialValues={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleProfileUpdate}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Full Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={values.email}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.currentPassword && Boolean(errors.currentPassword)}
                    helperText={touched.currentPassword && errors.currentPassword}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.newPassword && Boolean(errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmNewPassword && Boolean(errors.confirmNewPassword)}
                    helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        <Dialog open={showQRCode} onClose={() => setShowQRCode(false)}>
          <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              1. Install an authenticator app like Google Authenticator or Authy
            </Typography>
            <Typography variant="body1" paragraph>
              2. Scan the QR code below with your authenticator app
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              {qrCodeData && <QRCodeSVG value={qrCodeData} size={200} />}
            </Box>
            <Typography variant="body1" paragraph>
              3. Enter the 6-digit verification code from your authenticator app
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              error={Boolean(setupError)}
              helperText={setupError}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowQRCode(false)}>Cancel</Button>
            <Button
              onClick={handleVerify2FA}
              variant="contained"
              disabled={!verificationCode || verificationCode.length !== 6}
            >
              Verify
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Profile;