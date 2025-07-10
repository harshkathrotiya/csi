import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const services = []; // This will be populated from the services slice
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch services when component mounts
    // dispatch(fetchServices());
  }, [dispatch]);

  const handleBooking = (serviceId) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/book-appointment', { state: { serviceId } });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose from our wide range of professional services
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {service.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  ${service.price}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {service.duration} minutes
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBooking(service._id)}
                >
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {services.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No services available at the moment
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Services;