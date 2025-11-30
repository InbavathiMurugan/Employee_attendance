import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myHistory } from '../../features/attendance/attendanceSlice';

export default function MyHistory() {
  const dispatch = useDispatch();
  const records = useSelector(state => state.attendance.records);
  const error = useSelector(state => state.attendance.error);

  useEffect(() => {
    dispatch(myHistory());
  }, [dispatch]);

  return (
    <div>
      <h2>My Attendance History</h2>
      {error && <div className="text-red-600">{error}</div>}
      <ul>
        {records.map(r => (
          <li key={r._id}>{r.date} — {r.status}</li>
        ))}
      </ul>
    </div>
  );
}
