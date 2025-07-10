const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Health check endpoint
router.get('/', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    res.status(503).send();
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      database: 'OK',
      server: 'OK'
    }
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    switch (dbState) {
      case 0:
        healthcheck.services.database = 'Disconnected';
        break;
      case 1:
        healthcheck.services.database = 'Connected';
        break;
      case 2:
        healthcheck.services.database = 'Connecting';
        break;
      case 3:
        healthcheck.services.database = 'Disconnecting';
        break;
      default:
        healthcheck.services.database = 'Unknown';
    }

    // Check memory usage
    const used = process.memoryUsage();
    healthcheck.memory = {
      rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`
    };

    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    healthcheck.error = e;
    res.status(503).send(healthcheck);
  }
});

module.exports = router;