import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { addHours, format, parse, isAfter, isBefore, startOfDay } from 'date-fns';
import { fetchServices } from '../../store/slices/serviceSlice';
import { createAppointment } from '../../store/slices/appointmentSlice';

const validationSchema = Yup.object({
  serviceId: Yup.string().required('Service is required'),
  staffId: Yup.string().required('Staff member is required'),
  date: Yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
  time: Yup.date().required('Time is required'),
  notes: Yup.string().max(500, 'Notes cannot exceed 500 characters')
});

const BookAppointment = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, loading: servicesLoading } = useSelector((state) => state.services);
  const { loading: appointmentLoading } = useSelector((state) => state.appointments);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find(s => s._id === serviceId);
      setSelectedService(service);
    }
  }, [serviceId, services]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const service = services.find(s => s._id === values.serviceId);
    const appointmentData = {
      ...values,
      startTime: format(
        parse(format(values.date, 'yyyy-MM-dd') + ' ' + format(values.time, 'HH:mm'), 'yyyy-MM-dd HH:mm', new Date()),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      endTime: format(
        addHours(
          parse(format(values.date, 'yyyy-MM-dd') + ' ' + format(values.time, 'HH:mm'), 'yyyy-MM-dd HH:mm', new Date()),
          service.duration / 60
        ),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      )
    };

    const result = await dispatch(createAppointment(appointmentData));
    if (result.payload?.success) {
      navigate('/appointments');
    }
    setSubmitting(false);
  };

  const isTimeSlotValid = (time) => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    // Assuming business hours are 9 AM to 5 PM
    return hour >= 9 && (hour < 17 || (hour === 17 && minutes === 0));
  };

  if (servicesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Appointment
        </Typography>

        <Formik
          initialValues={{
            serviceId: serviceId || '',
            staffId: '',
            date: startOfDay(new Date()),
            time: new Date(),
            notes: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            const selectedService = services.find(s => s._id === values.serviceId);

            return (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      id="serviceId"
                      name="serviceId"
                      label="Service"
                      value={values.serviceId}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue('staffId', '');
                      }}
                      onBlur={handleBlur}
                      error={touched.serviceId && Boolean(errors.serviceId)}
                      helperText={touched.serviceId && errors.serviceId}
                    >
                      {services.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          {service.name} - ${service.price} ({service.duration} mins)
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {selectedService && (
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        id="staffId"
                        name="staffId"
                        label="Staff Member"
                        value={values.staffId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.staffId && Boolean(errors.staffId)}
                        helperText={touched.staffId && errors.staffId}
                      >
                        {selectedService.staff.map((staff) => (
                          <MenuItem key={staff._id} value={staff._id}>
                            {staff.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date"
                        value={values.date}
                        onChange={(newValue) => {
                          setFieldValue('date', newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={touched.date && Boolean(errors.date)}
                            helperText={touched.date && errors.date}
                          />
                        )}
                        minDate={new Date()}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="Time"
                        value={values.time}
                        onChange={(newValue) => {
                          setFieldValue('time', newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={touched.time && Boolean(errors.time)}
                            helperText={touched.time && errors.time}
                          />
                        )}
                        shouldDisableTime={(time, type) => !isTimeSlotValid(time)}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="notes"
                      name="notes"
                      label="Notes (Optional)"
                      multiline
                      rows={4}
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.notes && Boolean(errors.notes)}
                      helperText={touched.notes && errors.notes}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isSubmitting || appointmentLoading}
                      sx={{ mt: 2 }}
                    >
                      {appointmentLoading ? <CircularProgress size={24} /> : 'Book Appointment'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </Container>
  );
};

export default BookAppointment;