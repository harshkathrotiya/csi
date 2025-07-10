import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  notifications: [],
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;

      // Show toast notification based on type
      switch (notification.type) {
        case 'APPOINTMENT_CREATED':
          toast.success('New appointment booked!');
          break;
        case 'APPOINTMENT_UPDATED':
          toast.info('Appointment updated!');
          break;
        case 'APPOINTMENT_CANCELLED':
          toast.warning('Appointment cancelled!');
          break;
        case 'PAYMENT_RECEIVED':
          toast.success('Payment received!');
          break;
        case 'REMINDER':
          toast.info('Upcoming appointment reminder!');
          break;
        default:
          toast.info('New notification received!');
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        if (!notification.read) {
          notification.read = true;
        }
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  }
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;