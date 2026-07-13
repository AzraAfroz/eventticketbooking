const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seat.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/event/:eventId', authenticate, authorize(PERMISSIONS.VIEW_SEATS), seatController.getSeatsByEvent);
router.post('/:id/reserve', authenticate, authorize(PERMISSIONS.CREATE_BOOKINGS), seatController.reserveSeat);

module.exports = router;
