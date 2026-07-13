const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venue.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', authenticate, authorize(PERMISSIONS.VIEW_VENUES), venueController.getAllVenues);
router.get('/:id', authenticate, authorize(PERMISSIONS.VIEW_VENUES), venueController.getVenueById);
router.post('/', authenticate, authorize(PERMISSIONS.MANAGE_VENUES), venueController.createVenue);

module.exports = router;
