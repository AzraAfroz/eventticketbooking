const eventService = require('../services/event.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class EventController {
  getAllEvents = asyncHandler(async (req, res) => {
    const events = await eventService.getAllEvents();
    return successResponse(res, 200, 'Events fetched successfully', events);
  });

  getEventById = asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(req.params.id);
    return successResponse(res, 200, 'Event fetched successfully', event);
  });

  createEvent = asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.body);
    return successResponse(res, 201, 'Event created successfully', event);
  });
}

module.exports = new EventController();
