import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import serviceReducer from './slices/serviceSlice';
import appointmentReducer from './slices/appointmentSlice';
import staffReducer from './slices/staffSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    services: serviceReducer,
    appointments: appointmentReducer,
    staff: staffReducer,
    notifications: notificationReducer
  }
});

export default store;