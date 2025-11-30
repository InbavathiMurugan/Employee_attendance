const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Helper middleware to convert date from DD-MM-YYYY to YYYY-MM-DD
function convertDate(req, res, next) {
  if (req.query.date) {
    const parts = req.query.date.split("-");
    if (parts.length === 3) {
      req.query.date = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
    }
  }
  next();
}

// Employee endpoints
router.post('/checkin', attendanceController.checkin);
router.post('/checkout', attendanceController.checkout);
router.get('/my-history', attendanceController.myHistory);
router.get('/my-summary', attendanceController.mySummary);
router.get('/today', attendanceController.today);

// Manager endpoints
router.get('/all', convertDate, attendanceController.all); // Apply date conversion
router.get('/employee/:id', attendanceController.employee);
router.get('/summary', convertDate, attendanceController.summary);
router.get('/export-csv', convertDate, attendanceController.exportCsv);

module.exports = router;
