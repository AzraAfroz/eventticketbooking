const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const roleRoutes = require('./role.routes');
const permissionRoutes = require('./permission.routes');
const adminRoutes = require('./admin.routes');
const organizerRoutes = require('./organizer.routes');
const venueRoutes = require('./venue.routes');
const eventRoutes = require('./event.routes');
const seatRoutes = require('./seat.routes');
const bookingRoutes = require('./booking.routes');
const ticketRoutes = require('./ticket.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportRoutes = require('./report.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/role', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/permission', permissionRoutes);
router.use('/admins', adminRoutes);
router.use('/admin', adminRoutes);
router.use('/organizers', organizerRoutes);
router.use('/organizer', organizerRoutes);
router.use('/venues', venueRoutes);
router.use('/venue', venueRoutes);
router.use('/events', eventRoutes);
router.use('/event', eventRoutes);
router.use('/seats', seatRoutes);
router.use('/seat', seatRoutes);
router.use('/bookings', bookingRoutes);
router.use('/booking', bookingRoutes);
router.use('/tickets', ticketRoutes);
router.use('/ticket', ticketRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
