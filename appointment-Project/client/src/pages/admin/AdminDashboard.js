import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // These will be populated from their respective slices
  const stats = {
    totalAppointments: 0,
    pendingAppointments: 0,
    totalServices: 0,
    totalStaff: 0,
    totalUsers: 0,
    revenue: 0,
  };

  const recentAppointments = [];
  const recentServices = [];

  useEffect(() => {
    // Fetch admin dashboard data when component mounts
    // dispatch(fetchAdminDashboardData());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Appointments
              </Typography>
              <Typography variant="h4">{stats.totalAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Services
              </Typography>
              <Typography variant="h4">{stats.totalServices}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">${stats.revenue}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/manage-users')}
              >
                Manage Users
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/manage-services')}
              >
                Manage Services
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/manage-staff')}
              >
                Manage Staff
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/appointments')}
              >
                View All Appointments
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Appointments
            </Typography>
            <List>
              {recentAppointments.map((appointment, index) => (
                <React.Fragment key={appointment._id}>
                  <ListItem>
                    <ListItemText
                      primary={appointment.service.name}
                      secondary={
                        <>
                          {new Date(appointment.date).toLocaleDateString()}
                          <br />
                          {appointment.user.firstName} {appointment.user.lastName}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentAppointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Services */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Services
            </Typography>
            <List>
              {recentServices.map((service, index) => (
                <React.Fragment key={service._id}>
                  <ListItem>
                    <ListItemText
                      primary={service.name}
                      secondary={
                        <>
                          ${service.price}
                          <br />
                          {service.duration} minutes
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentServices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;