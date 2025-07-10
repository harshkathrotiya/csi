require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./config/database');
const routes = require('./routes');
const { initializeSocket } = require('./utils/socketHandler');
const errorHandler = require('./utils/errorHandler');
const requestLogger = require('./middlewares/logger');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

// Trust proxy settings for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// Request logging
app.use(requestLogger);

// Body parsing and compression
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// API Routes
app.use('/api', routes);

// Global error handling middleware
app.use(errorHandler);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new errorHandler.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Start server
const PORT = process.env.PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server in production
  if (process.env.NODE_ENV === 'development') {
    server.close(() => process.exit(1));
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't crash the server in production
  if (process.env.NODE_ENV === 'development') {
    server.close(() => process.exit(1));
  }
});