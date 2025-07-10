# Appointment Scheduling System

A full-featured appointment scheduling system for service-based businesses with real-time notifications and payment integration.

## Features

- 🔐 JWT-based Authentication with Role Management
- 📅 Appointment Booking & Management
- 🧑 Staff Scheduling
- 💳 Razorpay Payment Integration
- 🔔 Real-time Notifications (Socket.IO)
- 📧 Email Notifications
- 📊 Analytics Dashboard
- 🔒 Two-Factor Authentication

## Tech Stack

- Backend: Node.js + Express
- Database: MongoDB (Mongoose ODM)
- Authentication: JWT + bcrypt
- Real-time: Socket.IO
- Payments: Razorpay
- Email: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Razorpay Account
- SMTP Server (for email notifications)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd appointment-scheduling-system
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies (when frontend is ready)
cd ../client
npm install
```

3. Configure environment variables:
```bash
# Copy example env file
cp .env.example .env

# Update .env with your configurations
```

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication

```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
POST /api/auth/verify-2fa - Verify 2FA token
POST /api/auth/setup-2fa - Setup 2FA
POST /api/auth/enable-2fa - Enable 2FA
```

### Appointments

```
POST /api/appointments - Create new appointment
GET /api/appointments/my-appointments - Get user's appointments
GET /api/appointments/staff-schedule - Get staff schedule
PATCH /api/appointments/:id/status - Update appointment status
POST /api/appointments/payment-webhook - Handle payment webhook
```

### Services

```
GET /api/services - Get all services
GET /api/services/:id - Get service by ID
POST /api/services - Create new service (Admin)
PUT /api/services/:id - Update service (Admin)
DELETE /api/services/:id - Delete service (Admin)
GET /api/services/category/:category - Get services by category
GET /api/services/:serviceId/availability/:date - Get service availability
```

## Default Users

After running the seeder, you can use these accounts:

```
Admin:
email: admin@example.com
password: admin123

Staff:
email: staff1@example.com
password: staff123

User:
email: user@example.com
password: user123
```

## Socket.IO Events

### Client Events
```
socket.emit('authenticate', userId) - Authenticate user
socket.on('notification', callback) - Listen for notifications
```

### Server Events
```
APPOINTMENT_CREATED
APPOINTMENT_UPDATED
APPOINTMENT_CANCELLED
PAYMENT_RECEIVED
REMINDER
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.