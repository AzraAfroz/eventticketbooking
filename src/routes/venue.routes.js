const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venue.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createVenue, updateVenue } = require('../validations/venue.validation');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', authenticate, authorize(PERMISSIONS.VIEW_VENUES), venueController.getAllVenues);
router.get('/:id', authenticate, authorize(PERMISSIONS.VIEW_VENUES), venueController.getVenueById);
router.post('/', authenticate, authorize(PERMISSIONS.MANAGE_VENUES), validate(createVenue), venueController.createVenue);
router.put('/:id', authenticate, authorize(PERMISSIONS.MANAGE_VENUES), validate(updateVenue), venueController.updateVenue);
router.delete('/:id', authenticate, authorize(PERMISSIONS.MANAGE_VENUES), venueController.deleteVenue);

module.exports = router;
