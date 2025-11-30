const Attendance = require('../models/Attendance');
const User = require('../models/User');
const dayjs = require('dayjs');

const todayStr = () => dayjs().format('YYYY-MM-DD');

exports.employeeStats = async (req, res) => {
  const userId = req.user._id;
  const today = await Attendance.findOne({ userId, date: todayStr() });

  const month = dayjs().format('YYYY-MM');
  const records = await Attendance.find({ userId, date: { $regex: `^${month}` } });

  let present = 0, absent = 0, late = 0, totalHours = 0;
  records.forEach(r => {
    if (r.status === 'present') present++;
    else if (r.status === 'late') late++;
    else if (r.status === 'absent') absent++;
    totalHours += r.totalHours || 0;
  });

  const recent = await Attendance.find({ userId }).sort({ date: -1 }).limit(7);

  res.json({
    todayStatus: today ? (today.checkInTime ? 'Checked In' : 'Not Checked In') : 'Not Checked In',
    present, absent, late, totalHours,
    recent
  });
};

exports.managerStats = async (req, res) => {
  const totalEmployees = await User.countDocuments({ role: 'employee' });
  const date = todayStr();
  const todaysRecords = await Attendance.find({ date });
  const present = todaysRecords.filter(r => r.checkInTime).length;
  const late = todaysRecords.filter(r => r.status === 'late').length;
  const absent = Math.max(0, totalEmployees - present);

  // weekly trend (last 7 days)
  const trendDates = [];
  for (let i = 6; i >= 0; i--) trendDates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  const trend = [];
  for (const d of trendDates) {
    const count = await Attendance.countDocuments({ date: d, checkInTime: { $exists: true } });
    trend.push({ date: d, count });
  }

  // department-wise for today
  const all = await Attendance.find({ date }).populate('userId', 'department');
  const departmentWise = {};
  all.forEach(r => {
    const dep = r.userId.department || 'Unknown';
    departmentWise[dep] = (departmentWise[dep] || 0) + 1;
  });

  res.json({ totalEmployees, present, absent, late, trend, departmentWise });
};
