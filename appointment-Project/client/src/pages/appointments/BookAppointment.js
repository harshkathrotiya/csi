import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

const steps = ['Select Service', 'Choose Date & Time', 'Confirm Booking'];

const BookAppointment = () => {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const services = []; // This will be populated from the services slice

  useEffect(() => {
    // Fetch services when component mounts
    // dispatch(fetchServices());
  }, [dispatch]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleSubmit = () => {
    const appointmentData = {
      service: selectedService._id,
      dateTime: selectedDateTime,
    };
    // dispatch(bookAppointment(appointmentData));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} md={4} key={service._id}>
                <Card
                  sx={{
                    border: selectedService?._id === service._id ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                >
                  <CardActionArea onClick={() => handleServiceSelect(service)}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                        ${service.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {service.duration} minutes
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <DateTimePicker
                label="Appointment Date & Time"
                value={selectedDateTime}
                onChange={setSelectedDateTime}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
                minutesStep={30}
              />
            </Box>
          </LocalizationProvider>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Typography>
              Service: {selectedService?.name}
            </Typography>
            <Typography>
              Date: {selectedDateTime?.toLocaleDateString()}
            </Typography>
            <Typography>
              Time: {selectedDateTime?.toLocaleTimeString()}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              Total: ${selectedService?.price}
            </Typography>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Book an Appointment
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={
                (activeStep === 0 && !selectedService) ||
                (activeStep === 1 && !selectedDateTime)
              }
            >
              {activeStep === steps.length - 1 ? 'Book Appointment' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookAppointment;