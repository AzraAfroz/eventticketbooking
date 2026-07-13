const seatService = require('../services/seat.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class SeatController {
  getSeatsByEvent = asyncHandler(async (req, res) => {
    const seats = await seatService.getSeatsByEvent(req.params.eventId);
    return successResponse(res, 200, 'Seats fetched successfully', seats);
  });

  reserveSeat = asyncHandler(async (req, res) => {
    const seat = await seatService.reserveSeat(req.params.id);
    return successResponse(res, 200, 'Seat reserved successfully', seat);
  });
}

module.exports = new SeatController();
