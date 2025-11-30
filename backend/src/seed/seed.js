import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employeeAttendanceDB';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const seedUsers = async () => {
  try {
    await User.deleteMany({});

    // Manager
    const managerPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Alice Manager',
      email: 'alice.manager@example.com',
      password: 'password123',
      role: 'manager',
      employeeId: 'EMP001',       // added
      department: 'Management'    // optional
    });

    // Employee
    const employeePassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Bob Employee',
      email: 'bob.employee@example.com',
      password: 'password123',
      role: 'employee',
      employeeId: 'EMP002',       // added
      department: 'Engineering'   // optional
    });
    // Example: Employee 3
const employeePassword3 = await bcrypt.hash('password123', 10);
await User.create({
  name: 'Charlie Employee',
  email: 'charlie.employee@example.com',
  password: employeePassword3,
  role: 'employee',
  employeeId: 'EMP003',
  department: 'HR'
});

// Example: Employee 4
const employeePassword4 = await bcrypt.hash('password123', 10);
await User.create({
  name: 'David Employee',
  email: 'david.employee@example.com',
  password: employeePassword4,
  role: 'employee',
  employeeId: 'EMP004',
  department: 'Finance'
});


    console.log('Seed completed successfully.');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedUsers();
