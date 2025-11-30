import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkin, checkout } from "../../features/attendance/attendanceSlice";


const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { today, error } = useSelector(state => state.attendance);

  return (
    <div>
      <h2>Mark Attendance</h2>
      <button onClick={() => dispatch(checkin())}>Check In</button>
      <button onClick={() => dispatch(checkout())}>Check Out</button>

      {today && (
        <div>
          <p>Status: {today.status}</p>
          <p>Check-in: {today.checkInTime}</p>
          <p>Check-out: {today.checkOutTime}</p>
        </div>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default MarkAttendance;
