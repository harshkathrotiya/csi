import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fetchUserAppointments, updateAppointmentStatus } from '../../store/slices/appointmentSlice';

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'info'
};

const AppointmentsList = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(fetchUserAppointments());
  }, [dispatch]);

  const handleStatusChange = async () => {
    if (selectedAppointment && newStatus) {
      await dispatch(updateAppointmentStatus({
        appointmentId: selectedAppointment._id,
        status: newStatus
      }));
      setStatusDialogOpen(false);
      setSelectedAppointment(null);
      setNewStatus('');
    }
  };

  const openStatusDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setStatusDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No appointments found.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/services"
            sx={{ mt: 2 }}
          >
            Book an Appointment
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} key={appointment._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {appointment.service.name}
                    </Typography>
                    <Chip
                      label={appointment.status.toUpperCase()}
                      color={statusColors[appointment.status]}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {format(new Date(appointment.startTime), 'MMMM d, yyyy')}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {format(new Date(appointment.startTime), 'h:mm a')} -{' '}
                          {format(new Date(appointment.endTime), 'h:mm a')}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {appointment.staff.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          ${appointment.service.price.toFixed(2)}
                        </Typography>
                      </Box>

                      {appointment.notes && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <NotesIcon sx={{ mr: 1, color: 'primary.main', mt: 0.5 }} />
                          <Typography variant="body1">{appointment.notes}</Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                      {(user.role === 'admin' || user.role === 'staff') && (
                        <Button
                          variant="outlined"
                          onClick={() => openStatusDialog(appointment)}
                          sx={{ ml: 2 }}
                        >
                          Update Status
                        </Button>
                      )}
                      {appointment.status === 'pending' && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => openStatusDialog(appointment)}
                          sx={{ ml: 2 }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            margin="dense"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentsList;