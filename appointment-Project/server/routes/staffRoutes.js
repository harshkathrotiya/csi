const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const User = require('../models/User');

// @route   GET /api/staff
// @desc    Get all staff members
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const staffMembers = await User.find({ role: 'staff' })
      .select('-password -twoFactorSecret');
    res.json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/staff
// @desc    Create a new staff member
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, password, specialties, active } = req.body;

    // Check if staff member already exists
    let staff = await User.findOne({ email });
    if (staff) {
      return res.status(400).json({ message: 'Staff member already exists' });
    }

    // Create new staff member
    staff = new User({
      name,
      email,
      phone,
      password,
      role: 'staff',
      specialties,
      active
    });

    await staff.save();

    // Remove sensitive data before sending response
    const staffResponse = staff.toObject();
    delete staffResponse.password;
    delete staffResponse.twoFactorSecret;

    res.status(201).json(staffResponse);
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/staff/:id
// @desc    Update a staff member
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, password, specialties, active } = req.body;

    // Build staff object
    const staffFields = {};
    if (name) staffFields.name = name;
    if (email) staffFields.email = email;
    if (phone) staffFields.phone = phone;
    if (password) staffFields.password = password;
    if (specialties) staffFields.specialties = specialties;
    if (typeof active === 'boolean') staffFields.active = active;

    let staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (staff.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    // If email is being updated, check if it's already in use
    if (email && email !== staff.email) {
      const existingStaff = await User.findOne({ email });
      if (existingStaff) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    staff = await User.findByIdAndUpdate(
      req.params.id,
      { $set: staffFields },
      { new: true }
    ).select('-password -twoFactorSecret');

    res.json(staff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/staff/:id
// @desc    Delete a staff member
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (staff.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    await staff.remove();

    res.json({ message: 'Staff member removed' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;