import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Appointment Scheduling System
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Book appointments easily and manage your schedule efficiently
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/services')}
              >
                View Services
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/login')}
              >
                Book Appointment
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;