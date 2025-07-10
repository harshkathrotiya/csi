const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory,
  getServiceAvailability
} = require('../controllers/serviceController');

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.get('/category/:category', getServicesByCategory);
router.get('/:serviceId/availability/:date', getServiceAvailability);

// Protected routes
router.use(protect);

// Admin only routes
router.use(authorize('admin'));
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

// Export router
module.exports = router;