import React, { useEffect } from 'react';
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
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = []; // This will be populated from the notifications slice

  useEffect(() => {
    // Fetch notifications when component mounts
    // dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (notificationId) => {
    // dispatch(markNotificationAsRead(notificationId));
  };

  const handleDelete = (notificationId) => {
    // dispatch(deleteNotification(notificationId));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>

        {notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No notifications
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                  }}
                  secondaryAction={
                    <Box>
                      {!notification.read && (
                        <IconButton
                          edge="end"
                          aria-label="mark as read"
                          onClick={() => handleMarkAsRead(notification._id)}
                          sx={{ mr: 1 }}
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(notification._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <NotificationsIcon
                      color={notification.read ? 'disabled' : 'primary'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={formatTimestamp(notification.createdAt)}
                    primaryTypographyProps={{
                      style: {
                        fontWeight: notification.read ? 'normal' : 'bold',
                      },
                    }}
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Notifications;