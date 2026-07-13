const { Ticket, Booking, Seat, Event } = require('../models');

class TicketRepository {
  async findByTicketNumber(ticketNumber) {
    return await Ticket.findOne({
      where: { ticketNumber },
      include: [
        {
          model: Booking,
          as: 'booking',
          include: [{ model: Event, as: 'event' }]
        },
        { model: Seat, as: 'seat' }
      ]
    });
  }

  async createTickets(ticketsData) {
    return await Ticket.bulkCreate(ticketsData);
  }
}

module.exports = new TicketRepository();
