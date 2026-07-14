const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/:ticketNumber', authenticate, authorize(PERMISSIONS.VIEW_TICKETS), ticketController.getTicketDetails);
router.get('/:ticketNumber/download', authenticate, authorize(PERMISSIONS.VIEW_TICKETS), ticketController.downloadTicket);
router.post('/:ticketNumber/resend', authenticate, authorize(PERMISSIONS.VIEW_TICKETS), ticketController.resendTicket);
router.post('/validate', authenticate, authorize(PERMISSIONS.MANAGE_TICKETS), ticketController.validateTicket);

module.exports = router;
