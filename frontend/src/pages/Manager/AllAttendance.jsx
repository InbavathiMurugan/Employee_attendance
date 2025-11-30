import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import dayjs from 'dayjs';

export default function AllAttendance() {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ employeeId:'', date:'', status:'' });

  const fetch = async () => {
    const res = await API.get('/attendance/all', { params: filters });
    setRecords(res.data.records);
  };

  useEffect(() => { fetch(); }, []);

  const handleExport = async () => {
    const res = await API.get('/attendance/export', { params: filters, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download','attendance_export.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="flex gap-2">
          <input className="p-2 border rounded" placeholder="Employee ID" value={filters.employeeId} onChange={e=>setFilters({...filters, employeeId:e.target.value})} />
          <input type="date" className="p-2 border rounded" value={filters.date} onChange={e=>setFilters({...filters, date:e.target.value})} />
          <select className="p-2 border rounded" value={filters.status} onChange={e=>setFilters({...filters, status:e.target.value})}>
            <option value="">All</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
          </select>
          <button className="btn" onClick={fetch}>Filter</button>
          <button className="btn bg-emerald-600 hover:bg-emerald-700" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl mb-3">Records</h2>
        <table className="table">
          <thead><tr><th>Employee</th><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id} className="border-b">
                <td>{r.userId?.employeeId} — {r.userId?.name}</td>
                <td>{r.date}</td>
                <td>{r.checkInTime ? dayjs(r.checkInTime).format('HH:mm') : '-'}</td>
                <td>{r.checkOutTime ? dayjs(r.checkOutTime).format('HH:mm') : '-'}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
