const { Seat, SeatCategory } = require('../models');

class SeatRepository {
  async findByEventId(eventId) {
    return [];
  }

  async updateSeatStatus(seatId, status) {
    return null;
  }
}

module.exports = new SeatRepository();
