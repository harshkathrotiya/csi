import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { fetchStaffAppointments, updateAppointmentStatus } from '../../store/slices/appointmentSlice';

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'info'
};

const timeSlots = Array.from({ length: 17 - 9 }, (_, i) => i + 9)
  .map(hour => `${hour}:00`);

const StaffSchedule = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(fetchStaffAppointments());
  }, [dispatch]);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

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

  const getAppointmentsForTimeSlot = (day, timeSlot) => {
    return appointments.filter(appointment => {
      const appointmentStart = new Date(appointment.startTime);
      const slotStart = new Date(day.setHours(parseInt(timeSlot.split(':')[0]), 0, 0));
      const slotEnd = new Date(day.setHours(parseInt(timeSlot.split(':')[0]) + 1, 0, 0));

      return isWithinInterval(appointmentStart, { start: slotStart, end: slotEnd });
    });
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Staff Schedule
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Week"
            value={selectedDate}
            onChange={setSelectedDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      <Paper sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 800 }}>
          <Grid container>
            {/* Time slots column */}
            <Grid item xs={1}>
              <Box sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2">Time</Typography>
                </Box>
                {timeSlots.map((slot) => (
                  <Box
                    key={slot}
                    sx={{
                      p: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      height: '150px'
                    }}
                  >
                    <Typography>{slot}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Days columns */}
            {weekDays.map((day) => (
              <Grid item xs key={day.toISOString()}>
                <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      backgroundColor: 'grey.100'
                    }}
                  >
                    <Typography variant="subtitle2">
                      {format(day, 'EEE, MMM d')}
                    </Typography>
                  </Box>
                  {timeSlots.map((slot) => {
                    const slotAppointments = getAppointmentsForTimeSlot(day, slot);
                    return (
                      <Box
                        key={`${day.toISOString()}-${slot}`}
                        sx={{
                          p: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                          height: '150px',
                          overflow: 'auto'
                        }}
                      >
                        {slotAppointments.map((appointment) => (
                          <Card
                            key={appointment._id}
                            sx={{ mb: 1, backgroundColor: 'grey.50' }}
                          >
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2">
                                  {appointment.service.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={appointment.status.toUpperCase()}
                                  color={statusColors[appointment.status]}
                                />
                              </Box>
                              <Typography variant="body2">
                                {appointment.user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(appointment.startTime), 'h:mm a')}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => openStatusDialog(appointment)}
                                >
                                  Update
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

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

export default StaffSchedule;