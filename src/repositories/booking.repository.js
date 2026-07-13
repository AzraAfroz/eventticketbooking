const { Booking, Seat, Ticket, Event } = require('../models');

class BookingRepository {
  async create(bookingData) {
    return await Booking.create(bookingData);
  }

  async findById(id) {
    return await Booking.findByPk(id, {
      include: [
        { model: Event, as: 'event' },
        { model: Seat, as: 'seats' },
        { model: Ticket, as: 'tickets' }
      ]
    });
  }

  async updateStatus(id, status) {
    const booking = await Booking.findByPk(id);
    if (booking) {
      booking.status = status;
      await booking.save();
    }
    return booking;
  }
}

module.exports = new BookingRepository();
