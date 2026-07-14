const seatService = require('../services/seat.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class SeatController {
  getSeatsByEvent = asyncHandler(async (req, res) => {
    const seats = await seatService.getSeatsByEvent(req.params.eventId);
    return successResponse(res, 200, 'Seats fetched successfully', seats);
  });

  bulkGenerateSeats = asyncHandler(async (req, res) => {
    const { seatCategoryId, rows, columns } = req.body;
    const seats = await seatService.bulkGenerateSeats(seatCategoryId, rows, columns);
    return successResponse(res, 201, 'Seats generated successfully', seats);
  });

  reserveSeat = asyncHandler(async (req, res) => {
    const seat = await seatService.reserveSeat(req.params.id);
    return successResponse(res, 200, 'Seat reserved successfully', seat);
  });

  disableSeat = asyncHandler(async (req, res) => {
    const seat = await seatService.disableSeat(req.params.id);
    return successResponse(res, 200, 'Seat disabled successfully', seat);
  });

  enableSeat = asyncHandler(async (req, res) => {
    const seat = await seatService.enableSeat(req.params.id);
    return successResponse(res, 200, 'Seat enabled successfully', seat);
  });
}

module.exports = new SeatController();
