const Service = require('../models/Service');

// Create service
exports.createService = async (req, res) => {
  try {
    const { name, description, duration, price, category, staffMembers } = req.body;

    const service = await Service.create({
      name,
      description,
      duration,
      price,
      category,
      staffMembers
    });

    res.status(201).json({
      success: true,
      service
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('staffMembers', 'name email')
      .sort('category');

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('staffMembers', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { name, description, duration, price, category, staffMembers, isActive } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        duration,
        price,
        category,
        staffMembers,
        isActive
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('staffMembers', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Soft delete by setting isActive to false
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const services = await Service.find({
      category: req.params.category,
      isActive: true
    }).populate('staffMembers', 'name email');

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get service availability
exports.getServiceAvailability = async (req, res) => {
  try {
    const { serviceId, date } = req.params;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get all appointments for this service on the given date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      service: serviceId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'completed'] }
    }).select('startTime endTime staff');

    // Calculate available slots
    const availableSlots = [];
    const workingHours = {
      start: 9, // 9 AM
      end: 17 // 5 PM
    };

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(date);
      slotEnd.setHours(hour, service.duration, 0, 0);

      const isSlotAvailable = !appointments.some(apt => {
        return (slotStart >= apt.startTime && slotStart < apt.endTime) ||
               (slotEnd > apt.startTime && slotEnd <= apt.endTime);
      });

      if (isSlotAvailable) {
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd
        });
      }
    }

    res.status(200).json({
      success: true,
      availableSlots
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};