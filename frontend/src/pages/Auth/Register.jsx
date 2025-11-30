import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', employeeId:'', department:'' });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') nav('/employee/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Employee ID" value={form.employeeId} onChange={e=>setForm({...form, employeeId:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Department" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="btn w-full">Register</button>
      </form>
    </div>
  );
}
