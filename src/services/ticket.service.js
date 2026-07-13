const ticketRepository = require('../repositories/ticket.repository');
const ApiError = require('../utils/ApiError');
const { TICKET_STATUS } = require('../config/constants');

class TicketService {
  async getTicketDetails(ticketNumber) {
    const ticket = await ticketRepository.findByTicketNumber(ticketNumber);
    if (!ticket) {
      throw ApiError.notFound('Ticket not found');
    }
    return ticket;
  }

  async validateTicket(ticketNumber) {
    const ticket = await ticketRepository.findByTicketNumber(ticketNumber);
    if (!ticket) {
      throw ApiError.notFound('Ticket not found');
    }

    if (ticket.status !== TICKET_STATUS.ACTIVE) {
      return {
        isValid: false,
        message: `Ticket is invalid. Status: ${ticket.status}`,
        ticket
      };
    }

    // Update status to used
    ticket.status = TICKET_STATUS.USED;
    await ticket.save();

    return {
      isValid: true,
      message: 'Ticket validated successfully',
      ticket
    };
  }
}

module.exports = new TicketService();
