const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seat.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { bulkGenerate } = require('../validations/seat.validation');
const { PERMISSIONS } = require('../config/permissions');

router.get('/event/:eventId', authenticate, authorize(PERMISSIONS.VIEW_SEATS), seatController.getSeatsByEvent);
router.post('/bulk-generate', authenticate, authorize(PERMISSIONS.MANAGE_SEATS), validate(bulkGenerate), seatController.bulkGenerateSeats);
router.post('/:id/reserve', authenticate, authorize(PERMISSIONS.CREATE_BOOKINGS), seatController.reserveSeat);
router.post('/:id/disable', authenticate, authorize(PERMISSIONS.MANAGE_SEATS), seatController.disableSeat);
router.post('/:id/enable', authenticate, authorize(PERMISSIONS.MANAGE_SEATS), seatController.enableSeat);

module.exports = router;
