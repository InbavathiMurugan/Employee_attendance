import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const auth = useSelector(s => s.auth);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === 'fulfilled') {
      // redirect depending on role
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'manager') nav('/manager/all');
      else nav('/employee/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {auth.error && <div className="text-red-600 mb-2">{auth.error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="btn w-full">Login</button>
      </form>
    </div>
  );
}
