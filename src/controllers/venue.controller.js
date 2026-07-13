const venueService = require('../services/venue.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class VenueController {
  getAllVenues = asyncHandler(async (req, res) => {
    const venues = await venueService.getAllVenues();
    return successResponse(res, 200, 'Venues fetched successfully', venues);
  });

  getVenueById = asyncHandler(async (req, res) => {
    const venue = await venueService.getVenueById(req.params.id);
    return successResponse(res, 200, 'Venue fetched successfully', venue);
  });

  createVenue = asyncHandler(async (req, res) => {
    const venue = await venueService.createVenue(req.body);
    return successResponse(res, 201, 'Venue created successfully', venue);
  });
}

module.exports = new VenueController();
