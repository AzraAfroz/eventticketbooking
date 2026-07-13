const seatRepository = require('../repositories/seat.repository');
const ApiError = require('../utils/ApiError');
const { SEAT_STATUS } = require('../config/constants');

class SeatService {
  async getSeatsByEvent(eventId) {
    return await seatRepository.findByEventId(eventId);
  }

  async reserveSeat(seatId) {
    const seat = await seatRepository.updateSeatStatus(seatId, SEAT_STATUS.HOLD);
    if (!seat) {
      throw ApiError.notFound('Seat not found');
    }
    return seat;
  }
}

module.exports = new SeatService();
