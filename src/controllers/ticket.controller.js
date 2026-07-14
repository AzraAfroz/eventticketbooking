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

  downloadTicket = asyncHandler(async (req, res) => {
    const { ticketNumber } = req.params;
    const { pdfBuffer, filename } = await ticketService.downloadTicket(ticketNumber);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(pdfBuffer);
  });

  resendTicket = asyncHandler(async (req, res) => {
    const { ticketNumber } = req.params;
    const ticket = await ticketService.getTicketDetails(ticketNumber);
    const logger = require('../utils/logger');
    logger.info(`Resending ticket ${ticketNumber} to ${req.user.email}`);
    return successResponse(res, 200, `Ticket has been resent to ${req.user.email} successfully`, { ticketNumber });
  });
}

module.exports = new TicketController();
