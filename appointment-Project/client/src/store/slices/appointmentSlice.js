import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Async thunks
export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post('/api/appointments', appointmentData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserAppointments = createAsyncThunk(
  'appointments/getUserAppointments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('/api/appointments/my-appointments', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStaffAppointments = createAsyncThunk(
  'appointments/getStaffAppointments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('/api/appointments/staff-schedule', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ appointmentId, status }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.patch(
        `/api/appointments/${appointmentId}/status`,
        { status },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  paymentDetails: null
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearPaymentDetails: (state) => {
      state.paymentDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.unshift(action.payload.appointment);
        state.paymentDetails = action.payload.paymentOrder;
        toast.success('Appointment created successfully!');
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create appointment';
        toast.error(state.error);
      })

      // Get user appointments
      .addCase(getUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
      })
      .addCase(getUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch appointments';
        toast.error(state.error);
      })

      // Get staff appointments
      .addCase(getStaffAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
      })
      .addCase(getStaffAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch staff schedule';
        toast.error(state.error);
      })

      // Update appointment status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (apt) => apt._id === action.payload.appointment._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload.appointment;
        }
        toast.success('Appointment status updated successfully!');
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update appointment status';
        toast.error(state.error);
      });
  }
});

export const {
  setSelectedAppointment,
  clearAppointmentError,
  clearPaymentDetails
} = appointmentSlice.actions;

export default appointmentSlice.reducer;