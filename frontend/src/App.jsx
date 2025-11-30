import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EmployeeDashboard from './pages/Employee/Dashboard';
import MarkAttendance from './pages/Employee/MarkAttendance';
import MyHistory from './pages/Employee/MyHistory';
import ManagerAll from './pages/Manager/AllAttendance';
import ManagerReports from './pages/Manager/Reports';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee routes */}
          <Route element={<ProtectedRoute roles={['employee','manager']} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/mark" element={<MarkAttendance />} />
            <Route path="/employee/history" element={<MyHistory />} />
          </Route>

          {/* Manager routes */}
          <Route element={<ProtectedRoute roles={['manager']} />}>
            <Route path="/manager/all" element={<ManagerAll />} />
            <Route path="/manager/reports" element={<ManagerReports />} />
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-64 bg-red-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-700">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
