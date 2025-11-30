const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Store date in YYYY-MM-DD format (string) for easy filtering
  date: { type: String, required: true },

  // Store ISO datetime strings
  checkInTime: { type: String, default: null },
  checkOutTime: { type: String, default: null },

  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half-day'], 
    default: 'absent' 
  },

  totalHours: { type: Number, default: 0 }, // fractional hours allowed
  notes: { type: String, default: '' },      // optional corrections
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate attendance for the same user on the same date
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
