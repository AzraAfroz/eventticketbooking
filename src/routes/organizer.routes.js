const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizer.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createOrganizer, updateOrganizer } = require('../validations/organizer.validation');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', authenticate, authorize(PERMISSIONS.MANAGE_ORGANIZERS), organizerController.getAllOrganizers);
router.get('/:id', authenticate, authorize(PERMISSIONS.MANAGE_ORGANIZERS), organizerController.getOrganizerById);
router.post('/', authenticate, validate(createOrganizer), organizerController.createOrganizer);
router.put('/:id', authenticate, authorize(PERMISSIONS.MANAGE_ORGANIZERS), validate(updateOrganizer), organizerController.updateOrganizer);
router.post('/:id/approve', authenticate, authorize(PERMISSIONS.MANAGE_ORGANIZERS), organizerController.approveOrganizer);
router.post('/:id/suspend', authenticate, authorize(PERMISSIONS.MANAGE_ORGANIZERS), organizerController.suspendOrganizer);
router.post('/:id/reject', authenticate, authorize(PERMISSIONS.MANAGE_ORGANIZERS), organizerController.rejectOrganizer);

module.exports = router;
