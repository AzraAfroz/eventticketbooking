const bookingService = require('../services/booking.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class BookingController {
  createBooking = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const booking = await bookingService.createBooking(userId, req.body);
    return successResponse(res, 201, 'Booking initiated successfully', booking);
  });

  getBookingById = asyncHandler(async (req, res) => {
    const booking = await bookingService.getBookingById(req.params.id);
    return successResponse(res, 200, 'Booking details fetched successfully', booking);
  });

  cancelBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.cancelBooking(req.params.id);
    return successResponse(res, 200, 'Booking cancelled successfully', booking);
  });
}

module.exports = new BookingController();
