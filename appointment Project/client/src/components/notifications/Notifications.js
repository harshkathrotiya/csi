import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Button,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Update as UpdateIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { markAsRead, markAllAsRead, clearNotifications } from '../../store/slices/notificationSlice';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'APPOINTMENT_CREATED':
      return <EventIcon color="primary" />;
    case 'APPOINTMENT_UPDATED':
      return <UpdateIcon color="info" />;
    case 'APPOINTMENT_CANCELLED':
      return <CancelIcon color="error" />;
    case 'PAYMENT_RECEIVED':
      return <PaymentIcon color="success" />;
    case 'REMINDER':
      return <NotificationsIcon color="warning" />;
    default:
      return <NotificationsIcon color="action" />;
  }
};

const getNotificationMessage = (notification) => {
  switch (notification.type) {
    case 'APPOINTMENT_CREATED':
      return `New appointment booked for ${notification.data.serviceName} with ${notification.data.staffName}`;
    case 'APPOINTMENT_UPDATED':
      return `Your appointment for ${notification.data.serviceName} has been updated to ${notification.data.status}`;
    case 'APPOINTMENT_CANCELLED':
      return `Your appointment for ${notification.data.serviceName} has been cancelled`;
    case 'PAYMENT_RECEIVED':
      return `Payment received for your appointment (${notification.data.serviceName})`;
    case 'REMINDER':
      return `Reminder: You have an appointment for ${notification.data.serviceName} tomorrow`;
    default:
      return notification.message;
  }
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearNotifications = () => {
    dispatch(clearNotifications());
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Notifications
            {unreadCount > 0 && (
              <Typography
                component="span"
                variant="h6"
                color="primary"
                sx={{ ml: 2 }}
              >
                ({unreadCount} unread)
              </Typography>
            )}
          </Typography>
          <Box>
            {unreadCount > 0 && (
              <Button
                startIcon={<DoneAllIcon />}
                onClick={handleMarkAllAsRead}
                sx={{ mr: 2 }}
              >
                Mark All as Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                color="error"
                onClick={handleClearNotifications}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: notification.read ? 'normal' : 'bold'
                        }}
                      >
                        {getNotificationMessage(notification)}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </Typography>
                    }
                  />
                  {!notification.read && (
                    <IconButton
                      edge="end"
                      onClick={() => handleMarkAsRead(notification.id)}
                      sx={{ ml: 2 }}
                    >
                      <CheckCircleIcon color="primary" />
                    </IconButton>
                  )}
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Notifications;