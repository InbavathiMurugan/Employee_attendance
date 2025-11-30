const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

exports.register = async (req, res) => {
  const { name, email, password, role = 'employee', employeeId, department = '' } = req.body;
  if (!name || !email || !password || !employeeId) {
    return res.status(400).json({ message: 'name, email, password and employeeId are required' });
  }
  const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
  if (exists) {
    return res.status(400).json({ message: 'Email or Employee ID already registered' });
  }
  const user = await User.create({ name, email, password, role, employeeId, department });
  const token = signToken(user._id);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signToken(user._id);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department
    }
  });
};

exports.me = async (req, res) => {
  // req.user populated by protect middleware
  res.json({ user: req.user });
};
