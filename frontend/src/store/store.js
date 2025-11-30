import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,          // Needed for Navbar user
    dashboard: dashboardReducer,
    attendance: attendanceReducer,
  },
});

export default store;
