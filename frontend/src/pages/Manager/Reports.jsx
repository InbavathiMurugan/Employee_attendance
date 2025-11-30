import React, { useState } from 'react';
import API from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [range, setRange] = useState({ start:'', end:'' });
  const [agg, setAgg] = useState([]);

  const fetch = async () => {
    const res = await API.get('/attendance/summary', { params: range });
    // map to chart data
    const data = res.data.agg.map(a => ({ status: a._id, count: a.count }));
    setAgg(data);
  };

  return (
    <div>
      <div className="card mb-4">
        <h2 className="text-xl mb-2">Generate Summary</h2>
        <div className="flex gap-2">
          <input type="date" className="p-2 border rounded" value={range.start} onChange={e=>setRange({...range, start:e.target.value})} />
          <input type="date" className="p-2 border rounded" value={range.end} onChange={e=>setRange({...range, end:e.target.value})} />
          <button className="btn" onClick={fetch}>Get Summary</button>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3">Status Distribution</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={agg}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
