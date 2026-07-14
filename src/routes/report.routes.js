const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/sales', authenticate, authorize(PERMISSIONS.VIEW_REPORTS), reportController.getSalesReport);
router.get('/revenue', authenticate, authorize(PERMISSIONS.VIEW_REPORTS), reportController.getRevenueReport);
router.get('/organizer-performance', authenticate, authorize(PERMISSIONS.VIEW_REPORTS), reportController.getOrganizerPerformance);
router.get('/customer-activity', authenticate, authorize(PERMISSIONS.VIEW_REPORTS), reportController.getCustomerActivity);
router.get('/booking-analytics', authenticate, authorize(PERMISSIONS.VIEW_REPORTS), reportController.getBookingAnalytics);

module.exports = router;
