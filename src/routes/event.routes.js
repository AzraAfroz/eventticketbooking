const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticate, authorize(PERMISSIONS.MANAGE_EVENTS), eventController.createEvent);

module.exports = router;
