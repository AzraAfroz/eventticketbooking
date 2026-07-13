const { Event, Venue, Booking, User, Role } = require('../models');
const { Op } = require('sequelize');

class DashboardRepository {
  async getSummaryStats() {
    const totalEvents = await Event.count();
    const totalVenues = await Venue.count();
    const totalBookings = await Booking.count();

    const customerRole = await Role.findOne({ where: { name: 'customer' } });
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
      totalEvents,
      totalVenues,
      totalBookings,
      totalCustomers,
      totalRevenue
    };
  }
}

module.exports = new DashboardRepository();
