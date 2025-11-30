const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const seedAttendance = async () => {
  try {
    await Attendance.deleteMany({});

    // Get all employees automatically
    const employees = await User.find({ role: "employee" });

    const dates = [
      "2025-11-30",
      "2025-11-29",
      "2025-11-28",
      "2025-11-27",
      "2025-11-26",
      "2025-11-25",
      "2025-11-24"
    ];

    const attendanceData = [];

    dates.forEach(d => {
      employees.forEach(emp => {
        attendanceData.push({
          userId: emp._id,
          date: d,                                // store as string YYYY-MM-DD
          checkInTime: `${d}T09:00:00.000Z`,     // ISO string
          checkOutTime: `${d}T17:00:00.000Z`,
          status: "present",
          totalHours: 8
        });
      });
    });

    await Attendance.insertMany(attendanceData);
    console.log("Attendance seeded correctly!");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAttendance();
