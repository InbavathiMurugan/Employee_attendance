const Attendance = require('../models/Attendance');
const User = require('../models/User');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dayjs = require('dayjs');

/** Helper: Today's date in YYYY-MM-DD */
const todayStr = () => dayjs().format('YYYY-MM-DD');

/* ================================================================
   CHECK-IN
================================================================ */
exports.checkin = async (req, res) => {
  try {
    const user = req.user;
    const date = todayStr();

    let attendance = await Attendance.findOne({ userId: user._id, date });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const checkInTime = dayjs().toISOString();

    // Late rule: after 09:30
    const now = dayjs();
    const lateCutoff = dayjs().hour(9).minute(30).second(0);
    const status = now.isAfter(lateCutoff) ? "late" : "present";

    if (!attendance) {
      attendance = new Attendance({
        userId: user._id,
        date,
        checkInTime,
        status
      });
    } else {
      attendance.checkInTime = checkInTime;
      attendance.status = status;
    }

    await attendance.save();
    res.json({ attendance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Check-in error" });
  }
};

/* ================================================================
   CHECK-OUT
================================================================ */
exports.checkout = async (req, res) => {
  try {
    const user = req.user;
    const date = todayStr();

    const attendance = await Attendance.findOne({ userId: user._id, date });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: "No check-in found today" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out" });
    }

    const checkOutTime = dayjs().toISOString();
    const totalHours = dayjs(checkOutTime).diff(dayjs(attendance.checkInTime), "hour", true);

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = Number(totalHours.toFixed(2));

    if (attendance.totalHours < 4) attendance.status = "half-day";

    await attendance.save();
    res.json({ attendance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout error" });
  }
};

/* ================================================================
   MY HISTORY
================================================================ */
exports.myHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // format YYYY-MM

    const filter = { userId };
    if (month) filter.date = { $regex: `^${month}` };

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json({ records });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "History error" });
  }
};

/* ================================================================
   MY SUMMARY
================================================================ */
exports.mySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query;

    if (!month) return res.status(400).json({ message: "month required (YYYY-MM)" });

    const records = await Attendance.find({ userId, date: { $regex: `^${month}` } });

    let present = 0, absent = 0, late = 0, halfDay = 0, totalHours = 0;

    records.forEach(r => {
      if (r.status === "present") present++;
      else if (r.status === "late") late++;
      else if (r.status === "half-day") halfDay++;
      else if (r.status === "absent") absent++;
      totalHours += r.totalHours || 0;
    });

    res.json({ present, absent, late, halfDay, totalHours });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Summary error" });
  }
};

/* ================================================================
   TODAY STATUS
================================================================ */
exports.today = async (req, res) => {
  try {
    const record = await Attendance.findOne({
      userId: req.user._id,
      date: todayStr()
    });
    res.json({ record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Today status error" });
  }
};

/* ================================================================
   MANAGER → ALL ATTENDANCE FILTERS
================================================================ */
exports.all = async (req, res) => {
  try {
    const { page = 1, limit = 50, employeeId, date, status } = req.query;

    const filter = {};

    // Employee filter
    if (employeeId) {
      const user = await User.findOne({ employeeId: employeeId.trim() });
      if (!user) return res.json({ records: [] });
      filter.userId = user._id;
    }

    // Date filter: convert DD-MM-YYYY → YYYY-MM-DD
    if (date) {
      const parts = date.split("-");
      if (parts.length === 3) {
        filter.date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        filter.date = date;
      }
    }

    // Status filter
    if (status) filter.status = status.toLowerCase().trim();

    const skip = (Number(page) - 1) * Number(limit);

    const records = await Attendance.find(filter)
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ records });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Manager list error" });
  }
};

/* ================================================================
   EMPLOYEE FULL HISTORY
================================================================ */
exports.employee = async (req, res) => {
  try {
    const id = req.params.id;
    const records = await Attendance.find({ userId: id }).sort({ date: -1 });
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Employee list error" });
  }
};

/* ================================================================
   MANAGER SUMMARY
================================================================ */
exports.summary = async (req, res) => {
  try {
    const { start, end } = req.query;
    const match = {};
    if (start && end) match.date = { $gte: start, $lte: end };

    const agg = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({ agg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Summary error" });
  }
};

/* ================================================================
   EXPORT CSV
================================================================ */
exports.exportCsv = async (req, res) => {
  try {
    const { start, end, employeeId } = req.query;
    const filter = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId: employeeId.trim() });
      if (!user) return res.status(400).json({ message: "Employee not found" });
      filter.userId = user._id;
    }

    if (start && end) filter.date = { $gte: start, $lte: end };

    const records = await Attendance.find(filter)
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 });

    const data = records.map(r => ({
      employeeId: r.userId.employeeId,
      name: r.userId.name,
      email: r.userId.email,
      department: r.userId.department || "",
      date: r.date,
      checkInTime: r.checkInTime || "",
      checkOutTime: r.checkOutTime || "",
      status: r.status,
      totalHours: r.totalHours || 0
    }));

    const path = require("path");
    const fs = require("fs");
    const outDir = path.join(__dirname, "../../tmp");

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    const filePath = path.join(outDir, `attendance_export_${Date.now()}.csv`);

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: "employeeId", title: "Employee ID" },
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "department", title: "Department" },
        { id: "date", title: "Date" },
        { id: "checkInTime", title: "Check In" },
        { id: "checkOutTime", title: "Check Out" },
        { id: "status", title: "Status" },
        { id: "totalHours", title: "Total Hours" }
      ]
    });

    await csvWriter.writeRecords(data);

    res.download(filePath, () => {
      setTimeout(() => {
        try { fs.unlinkSync(filePath); } catch (e) { }
      }, 15000);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "CSV export error" });
  }
};
