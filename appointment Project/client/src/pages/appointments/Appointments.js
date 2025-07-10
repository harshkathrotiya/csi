import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointments = []; // This will be populated from the appointments slice

  useEffect(() => {
    // Fetch appointments when component mounts
    // dispatch(fetchAppointments());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  My Appointments
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/book-appointment')}
                >
                  Book New Appointment
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {appointments.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No appointments found
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate('/book-appointment')}
              >
                Book Your First Appointment
              </Button>
            </Paper>
          </Grid>
        ) : (
          appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {appointment.service.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {new Date(appointment.date).toLocaleDateString()} at{' '}
                    {new Date(appointment.date).toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Staff: {appointment.staff.name}
                  </Typography>
                  <Chip
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  {appointment.status === 'pending' && (
                    <Button size="small" color="error">
                      Cancel
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Appointments;