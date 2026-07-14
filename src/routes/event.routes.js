const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createEvent, updateEvent } = require('../validations/event.validation');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticate, authorize(PERMISSIONS.MANAGE_EVENTS), validate(createEvent), eventController.createEvent);
router.put('/:id', authenticate, authorize(PERMISSIONS.MANAGE_EVENTS), validate(updateEvent), eventController.updateEvent);
router.post('/:id/cancel', authenticate, authorize(PERMISSIONS.MANAGE_EVENTS), eventController.cancelEvent);

module.exports = router;
