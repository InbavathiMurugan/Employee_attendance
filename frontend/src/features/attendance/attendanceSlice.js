import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api'; // your axios instance

// Async thunk: Check-in
export const checkin = createAsyncThunk(
  'attendance/checkin',
  async (_, thunkAPI) => {
    try {
      const response = await API.post('/attendance/checkin');
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk: Check-out
export const checkout = createAsyncThunk(
  'attendance/checkout',
  async (_, thunkAPI) => {
    try {
      const response = await API.post('/attendance/checkout');
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk: Fetch employee history
export const myHistory = createAsyncThunk(
  'attendance/myHistory',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/attendance/my-history'); // backend route
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Checkin
      .addCase(checkin.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(checkin.fulfilled, (state, action) => {
        state.records.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(checkin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Checkout
      .addCase(checkout.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(checkout.fulfilled, (state, action) => {
        state.records.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // My History
      .addCase(myHistory.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(myHistory.fulfilled, (state, action) => {
        state.records = action.payload;
        state.status = 'succeeded';
      })
      .addCase(myHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
