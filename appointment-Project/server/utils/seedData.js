require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const connectDB = require('../config/database');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123456',
    role: 'admin',
    phoneNumber: '1234567890'
  },
  {
    name: 'Staff Member 1',
    email: 'staff1@example.com',
    password: 'staff123456',
    role: 'staff',
    phoneNumber: '9876543210'
  },
  {
    name: 'Staff Member 2',
    email: 'staff2@example.com',
    password: 'staff123456',
    role: 'staff',
    phoneNumber: '8765432109'
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'user123456',
    role: 'user',
    phoneNumber: '7654321098'
  }
];

const services = [
  {
    name: 'Haircut',
    description: 'Professional haircut service',
    duration: 30,
    price: 300,
    category: 'Hair Care'
  },
  {
    name: 'Hair Coloring',
    description: 'Professional hair coloring service',
    duration: 120,
    price: 2000,
    category: 'Hair Care'
  },
  {
    name: 'Manicure',
    description: 'Nail care and beautification',
    duration: 45,
    price: 500,
    category: 'Nail Care'
  },
  {
    name: 'Pedicure',
    description: 'Foot care and beautification',
    duration: 60,
    price: 700,
    category: 'Nail Care'
  },
  {
    name: 'Facial',
    description: 'Deep cleansing facial treatment',
    duration: 60,
    price: 1000,
    category: 'Skin Care'
  },
  {
    name: 'Body Massage',
    description: 'Full body relaxation massage',
    duration: 90,
    price: 1500,
    category: 'Massage'
  }
];

// Seed data function
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Service.deleteMany();

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users seeded successfully');

    // Get staff members
    const staffMembers = createdUsers.filter(user => user.role === 'staff');

    // Add staff members to services
    const servicesWithStaff = services.map(service => ({
      ...service,
      staffMembers: staffMembers.map(staff => staff._id)
    }));

    // Create services
    await Service.create(servicesWithStaff);
    console.log('Services seeded successfully');

    console.log('Data seeding completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
seedData();