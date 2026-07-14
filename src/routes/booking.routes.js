const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createBooking } = require('../validations/booking.validation');
const { PERMISSIONS } = require('../config/permissions');

router.post('/', authenticate, authorize(PERMISSIONS.CREATE_BOOKINGS), validate(createBooking), bookingController.createBooking);
router.get('/:id', authenticate, authorize(PERMISSIONS.VIEW_BOOKINGS), bookingController.getBookingById);
router.post('/:id/cancel', authenticate, authorize(PERMISSIONS.VIEW_BOOKINGS), bookingController.cancelBooking);

module.exports = router;
