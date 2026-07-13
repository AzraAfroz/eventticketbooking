const { Ticket } = require('../models');

class TicketRepository {
  async findByTicketNumber(ticketNumber) {
    return null;
  }

  async createTickets(ticketsData) {
    return [];
  }
}

module.exports = new TicketRepository();
