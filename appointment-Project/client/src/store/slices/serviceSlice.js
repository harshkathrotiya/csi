import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Async thunks
export const getAllServices = createAsyncThunk(
  'services/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/services');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getServiceById = createAsyncThunk(
  'services/getById',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/services/${serviceId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (serviceData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post('/api/services', serviceData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ serviceId, serviceData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`/api/services/${serviceId}`, serviceData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (serviceId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.delete(`/api/services/${serviceId}`, config);
      return { serviceId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getServiceAvailability = createAsyncThunk(
  'services/getAvailability',
  async ({ serviceId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/services/${serviceId}/availability/${date}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  services: [],
  selectedService: null,
  availableSlots: [],
  loading: false,
  error: null,
  categories: new Set()
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    clearServiceError: (state) => {
      state.error = null;
    },
    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all services
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services;
        // Update categories
        state.categories = new Set(
          action.payload.services.map((service) => service.category)
        );
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch services';
        toast.error(state.error);
      })

      // Get service by ID
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload.service;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch service';
        toast.error(state.error);
      })

      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.unshift(action.payload.service);
        state.categories.add(action.payload.service.category);
        toast.success('Service created successfully!');
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create service';
        toast.error(state.error);
      })

      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(
          (service) => service._id === action.payload.service._id
        );
        if (index !== -1) {
          state.services[index] = action.payload.service;
        }
        toast.success('Service updated successfully!');
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update service';
        toast.error(state.error);
      })

      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(
          (service) => service._id !== action.payload.serviceId
        );
        toast.success('Service deleted successfully!');
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete service';
        toast.error(state.error);
      })

      // Get service availability
      .addCase(getServiceAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload.availableSlots;
      })
      .addCase(getServiceAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch availability';
        toast.error(state.error);
      });
  }
});

export const {
  setSelectedService,
  clearServiceError,
  clearAvailableSlots
} = serviceSlice.actions;

export default serviceSlice.reducer;