const { Event, Venue, Booking, User, Role, Organizer, Ticket } = require('../models');
const { Op } = require('sequelize');
const { ROLES } = require('../config/constants');

class DashboardRepository {
  async getSummaryStats(user) {
    if (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN) {
      const totalEvents = await Event.count();
      const totalVenues = await Venue.count();
      const totalBookings = await Booking.count();

      const customerRole = await Role.findOne({ where: { name: ROLES.CUSTOMER } });
      const totalCustomers = customerRole ? await User.count({ where: { roleId: customerRole.id } }) : 0;

      const sumResult = await Booking.sum('totalAmount', {
        where: {
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      });
      const totalRevenue = sumResult ? parseFloat(sumResult) : 0;

      return {
        dashboardType: 'admin',
        totalEvents,
        totalVenues,
        totalBookings,
        totalCustomers,
        totalRevenue
      };
    } else if (user.role === ROLES.ORGANIZER) {
      const organizer = await Organizer.findOne({ where: { userId: user.id } });
      if (!organizer) {
        return {
          dashboardType: 'organizer',
          totalEvents: 0,
          totalBookings: 0,
          totalRevenue: 0
        };
      }

      const organizerId = organizer.id;
      const totalEvents = await Event.count({ where: { organizerId } });
      
      const totalBookings = await Booking.count({
        include: [{
          model: Event,
          as: 'event',
          where: { organizerId }
        }]
      });

      const organizerBookings = await Booking.findAll({
        where: {
          status: {
            [Op.ne]: 'cancelled'
          }
        },
        include: [{
          model: Event,
          as: 'event',
          where: { organizerId }
        }]
      });
      const totalRevenue = organizerBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);

      return {
        dashboardType: 'organizer',
        totalEvents,
        totalBookings,
        totalRevenue
      };
    } else if (user.role === ROLES.CUSTOMER) {
      const totalBookings = await Booking.count({ where: { userId: user.id } });
      
      const activeTickets = await Ticket.count({
        include: [{
          model: Booking,
          as: 'booking',
          where: { userId: user.id }
        }],
        where: { status: 'active' }
      });

      const sumResult = await Booking.sum('totalAmount', {
        where: {
          userId: user.id,
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      });
      const totalSpent = sumResult ? parseFloat(sumResult) : 0;

      return {
        dashboardType: 'customer',
        totalBookings,
        activeTickets,
        totalSpent
      };
    }

    return {};
  }
}

module.exports = new DashboardRepository();
