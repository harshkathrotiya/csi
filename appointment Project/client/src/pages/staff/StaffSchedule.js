import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from '@mui/x-date-pickers';

const StaffSchedule = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState({
    date: new Date(),
    startTime: null,
    endTime: null,
  });

  const schedule = []; // This will be populated from the schedule slice

  useEffect(() => {
    // Fetch staff schedule when component mounts
    // dispatch(fetchStaffSchedule());
  }, [dispatch]);

  const handleAddAvailability = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAvailabilityForm({
      date: new Date(),
      startTime: null,
      endTime: null,
    });
  };

  const handleSubmitAvailability = () => {
    // dispatch(addAvailability(availabilityForm));
    handleCloseDialog();
  };

  const formatTime = (date) => {
    return date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">My Schedule</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAvailability}
              >
                Add Availability
              </Button>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ mb: 4 }}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Box>

              <Grid container spacing={3}>
                {schedule.map((slot) => (
                  <Grid item xs={12} sm={6} md={4} key={slot._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {new Date(slot.date).toLocaleDateString()}
                        </Typography>
                        <Typography color="text.secondary">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              // dispatch(deleteAvailability(slot._id));
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </LocalizationProvider>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Availability Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Availability</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Date"
                value={availabilityForm.date}
                onChange={(newDate) =>
                  setAvailabilityForm({ ...availabilityForm, date: newDate })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TimePicker
                label="Start Time"
                value={availabilityForm.startTime}
                onChange={(newTime) =>
                  setAvailabilityForm({ ...availabilityForm, startTime: newTime })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TimePicker
                label="End Time"
                value={availabilityForm.endTime}
                onChange={(newTime) =>
                  setAvailabilityForm({ ...availabilityForm, endTime: newTime })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitAvailability} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffSchedule;