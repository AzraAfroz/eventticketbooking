const ticketService = require('../services/ticket.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class TicketController {
  getTicketDetails = asyncHandler(async (req, res) => {
    const ticket = await ticketService.getTicketDetails(req.params.ticketNumber);
    return successResponse(res, 200, 'Ticket details fetched successfully', ticket);
  });

  validateTicket = asyncHandler(async (req, res) => {
    const ticket = await ticketService.validateTicket(req.body.ticketNumber);
    return successResponse(res, 200, 'Ticket validated successfully', ticket);
  });
}

module.exports = new TicketController();
