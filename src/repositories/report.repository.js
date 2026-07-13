const { Event, Booking, Ticket } = require('../models');
const { Op } = require('sequelize');

class ReportRepository {
  async getSalesReport(startDate, endDate) {
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: new Date(endDate)
      };
    }

    const events = await Event.findAll({
      include: [{
        model: Booking,
        as: 'bookings',
        where: whereClause,
        required: false,
        include: [{
          model: Ticket,
          as: 'tickets'
        }]
      }]
    });

    return events.map(event => {
      const activeBookings = event.bookings.filter(b => b.status !== 'cancelled');
      const totalBookings = activeBookings.length;
      let totalTicketsSold = 0;
      let totalRevenue = 0;

      activeBookings.forEach(booking => {
        totalTicketsSold += booking.tickets ? booking.tickets.length : 0;
        totalRevenue += parseFloat(booking.totalAmount) || 0;
      });

      return {
        eventId: event.id,
        eventTitle: event.title,
        totalBookings,
        totalTicketsSold,
        totalRevenue
      };
    });
  }
}

module.exports = new ReportRepository();
