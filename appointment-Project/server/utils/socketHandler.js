let io;

// Initialize Socket.IO
const initializeSocket = (httpServer) => {
  io = require('socket.io')(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Store connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle user authentication
    socket.on('authenticate', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} authenticated`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });

  return io;
};

// Send notification to specific user
const sendNotificationToUser = (userId, notification) => {
  try {
    const socketId = connectedUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Send notification to staff members
const sendNotificationToStaff = (notification) => {
  try {
    io.to('staff').emit('notification', notification);
  } catch (error) {
    console.error('Error sending staff notification:', error);
  }
};

// Notification types
const notificationTypes = {
  APPOINTMENT_CREATED: 'APPOINTMENT_CREATED',
  APPOINTMENT_UPDATED: 'APPOINTMENT_UPDATED',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  REMINDER: 'REMINDER'
};

// Create notification object
const createNotification = (type, data) => {
  return {
    type,
    data,
    timestamp: new Date()
  };
};

// Handle appointment notifications
const handleAppointmentNotification = async (type, appointment) => {
  try {
    const populatedAppointment = await appointment
      .populate('user', 'name email')
      .populate('staff', 'name email')
      .populate('service', 'name');

    const notification = createNotification(type, {
      appointmentId: appointment._id,
      service: populatedAppointment.service.name,
      startTime: appointment.startTime,
      status: appointment.status
    });

    // Send to user
    sendNotificationToUser(populatedAppointment.user._id, notification);

    // Send to staff
    sendNotificationToUser(populatedAppointment.staff._id, notification);

    // If cancelled, also notify admin
    if (type === notificationTypes.APPOINTMENT_CANCELLED) {
      sendNotificationToStaff(notification);
    }
  } catch (error) {
    console.error('Error handling appointment notification:', error);
  }
};

// Handle payment notifications
const handlePaymentNotification = async (appointment, payment) => {
  try {
    const notification = createNotification(notificationTypes.PAYMENT_RECEIVED, {
      appointmentId: appointment._id,
      amount: payment.amount,
      status: payment.status
    });

    // Send to user
    sendNotificationToUser(appointment.user, notification);

    // Send to staff
    sendNotificationToUser(appointment.staff, notification);
  } catch (error) {
    console.error('Error handling payment notification:', error);
  }
};

module.exports = {
  initializeSocket,
  sendNotificationToUser,
  sendNotificationToStaff,
  notificationTypes,
  handleAppointmentNotification,
  handlePaymentNotification
};