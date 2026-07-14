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

  async downloadTicket(ticketNumber) {
    const ticket = await this.getTicketDetails(ticketNumber);
    
    const content = `Ticket Number: ${ticket.ticketNumber}
Event: ${ticket.booking.event.title}
Seat: ${ticket.seat.seatNumber}
Status: ${ticket.status}`;

    const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${content.length + 120} >>
stream
BT
/F1 12 Tf
70 700 Td
(Event Ticket Booking Platform) Tj
0 -20 Td
(Ticket Details:) Tj
0 -20 Td
(Ticket Number: ${ticket.ticketNumber}) Tj
0 -20 Td
(Event: ${ticket.booking.event.title}) Tj
0 -20 Td
(Seat: ${ticket.seat.seatNumber}) Tj
0 -20 Td
(Status: ${ticket.status}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000240 00000 n 
0000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${420 + content.length}
%%EOF`;

    return {
      pdfBuffer: Buffer.from(pdfBody, 'utf-8'),
      filename: `ticket-${ticketNumber}.pdf`
    };
  }
}

module.exports = new TicketService();
