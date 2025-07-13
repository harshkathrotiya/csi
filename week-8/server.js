const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { apiLimiter, authLimiter } = require('./middleware/rateLimitMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Handle CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Apply stricter rate limiting to authentication routes
app.use('/api/users/login', authLimiter);

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));

// Protected route example
const { protect } = require('./middleware/authMiddleware');
app.get('/api/protected', protect, (req, res) => {
  res.json({
    status: 'success',
    message: 'You have access to this protected route',
    user: req.user
  });
});

// Global error handling middleware
app.use(errorHandler);

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jwt-auth-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});