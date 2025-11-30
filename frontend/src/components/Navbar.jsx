import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const user = useSelector(state => state.auth?.user); // safe access

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Attendance System</h1>
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">Home</Link>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link to="/logout" className="hover:underline">Logout</Link>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
}
