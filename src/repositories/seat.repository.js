const { Seat, SeatCategory } = require('../models');

class SeatRepository {
  async findByEventId(eventId) {
    return await Seat.findAll({
      include: [{
        model: SeatCategory,
        as: 'category',
        where: { eventId }
      }]
    });
  }

  async updateSeatStatus(seatId, status) {
    const seat = await Seat.findByPk(seatId);
    if (seat) {
      seat.status = status;
      await seat.save();
    }
    return seat;
  }
}

module.exports = new SeatRepository();
