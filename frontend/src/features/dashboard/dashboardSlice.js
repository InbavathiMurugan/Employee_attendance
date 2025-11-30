import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const getEmployeeStats = createAsyncThunk('dashboard/employee', async () => {
  const res = await API.get('/dashboard/employee');
  return res.data;
});

export const getManagerStats = createAsyncThunk('dashboard/manager', async () => {
  const res = await API.get('/dashboard/manager');
  return res.data;
});

const slice = createSlice({
  name: 'dashboard',
  initialState: { stats: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(getManagerStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default slice.reducer;
