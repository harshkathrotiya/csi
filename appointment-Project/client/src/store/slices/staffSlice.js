import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Async thunks
export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/staff', staffData);
      toast.success('Staff member created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create staff member');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, ...staffData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/staff/${id}`, staffData);
      toast.success('Staff member updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update staff member');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/staff/${id}`);
      toast.success('Staff member deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete staff member');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchStaffMembers = createAsyncThunk(
  'staff/fetchStaffMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/staff');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch staff members');
      return rejectWithValue(error.response?.data);
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staffMembers: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create staff
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffMembers.push(action.payload);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create staff member';
      })

      // Update staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staffMembers.findIndex(staff => staff._id === action.payload._id);
        if (index !== -1) {
          state.staffMembers[index] = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update staff member';
      })

      // Delete staff
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffMembers = state.staffMembers.filter(staff => staff._id !== action.payload);
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete staff member';
      })

      // Fetch staff members
      .addCase(fetchStaffMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.staffMembers = action.payload;
      })
      .addCase(fetchStaffMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch staff members';
      });
  }
});

export const { clearError } = staffSlice.actions;
export default staffSlice.reducer;