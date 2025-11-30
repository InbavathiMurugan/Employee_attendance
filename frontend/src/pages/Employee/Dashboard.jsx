import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeStats } from '../../features/dashboard/dashboardSlice';
import { checkin, checkout } from '../../features/attendance/attendanceSlice';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(s => s.dashboard.stats);
  const attError = useSelector(s => s.attendance.error);

  useEffect(() => { dispatch(getEmployeeStats()); }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card col-span-2">
        <h2 className="text-xl font-semibold mb-2">Employee Dashboard</h2>
        {!stats ? <div>Loading...</div> : (
          <>
            <p>Today's status: <strong>{stats.todayStatus}</strong></p>
            <p>Present this month: {stats.present} | Late: {stats.late} | Absent: {stats.absent}</p>
            <p>Total hours this month: {stats.totalHours}</p>

            <div className="flex gap-2 mt-4">
              <button className="btn" onClick={()=>dispatch(checkin())}>Check In</button>
              <button className="btn bg-green-600 hover:bg-green-700" onClick={()=>dispatch(checkout())}>Check Out</button>
              <Link to="/employee/history" className="btn bg-slate-500">My History</Link>
            </div>
            {attError && <div className="text-red-600 mt-2">{attError}</div>}
          </>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Recent</h3>
        <ul>
          {stats?.recent?.map(r => (
            <li key={r._id} className="py-1 border-b">{r.date} — {r.status}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
