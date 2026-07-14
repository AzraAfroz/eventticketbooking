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

  async getRevenueReport(startDate, endDate) {
    const { sequelize } = require('../models');
    const where = { status: { [Op.ne]: 'cancelled' } };
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    return await Booking.findAll({
      where,
      attributes: [
        [sequelize.fn('date_trunc', 'day', sequelize.col('created_at')), 'date'],
        [sequelize.fn('count', sequelize.col('id')), 'totalBookings'],
        [sequelize.fn('sum', sequelize.col('total_amount')), 'totalRevenue']
      ],
      group: [sequelize.fn('date_trunc', 'day', sequelize.col('created_at'))],
      order: [[sequelize.fn('date_trunc', 'day', sequelize.col('created_at')), 'ASC']],
      raw: true
    });
  }

  async getOrganizerPerformance() {
    const { Organizer, User } = require('../models');
    const organizers = await Organizer.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { 
          model: Event, 
          as: 'events',
          include: [{ model: Booking, as: 'bookings', where: { status: { [Op.ne]: 'cancelled' } }, required: false }]
        }
      ]
    });
    
    return organizers.map(org => {
      let totalBookings = 0;
      let totalRevenue = 0;
      org.events.forEach(e => {
        totalBookings += e.bookings.length;
        e.bookings.forEach(b => {
          totalRevenue += parseFloat(b.totalAmount) || 0;
        });
      });
      return {
        organizerId: org.id,
        companyName: org.companyName,
        contactEmail: org.contactEmail,
        totalEvents: org.events.length,
        totalBookings,
        totalRevenue
      };
    });
  }

  async getCustomerActivity() {
    const { User, Role } = require('../models');
    const customerRole = await Role.findOne({ where: { name: 'customer' } });
    if (!customerRole) return [];
    
    const customers = await User.findAll({
      where: { roleId: customerRole.id },
      include: [{
        model: Booking,
        as: 'bookings',
        where: { status: { [Op.ne]: 'cancelled' } },
        required: false,
        include: [{ model: Ticket, as: 'tickets' }]
      }]
    });
    
    return customers.map(cust => {
      let totalTickets = 0;
      let totalSpent = 0;
      cust.bookings.forEach(b => {
        totalTickets += b.tickets ? b.tickets.length : 0;
        totalSpent += parseFloat(b.totalAmount) || 0;
      });
      return {
        customerId: cust.id,
        name: cust.name,
        email: cust.email,
        totalBookings: cust.bookings.length,
        totalTickets,
        totalSpent
      };
    });
  }

  async getBookingAnalytics() {
    const { SeatCategory, Seat } = require('../models');
    const events = await Event.findAll({
      include: [
        { model: SeatCategory, as: 'seatCategories' },
        { 
          model: Booking, 
          as: 'bookings', 
          where: { status: { [Op.ne]: 'cancelled' } }, 
          required: false,
          include: [{ model: Seat, as: 'seats' }]
        }
      ]
    });
    
    return events.map(event => {
      const totalCapacity = event.seatCategories.reduce((acc, cat) => acc + cat.capacity, 0);
      let bookedSeatsCount = 0;
      event.bookings.forEach(b => {
        bookedSeatsCount += b.seats ? b.seats.length : 0;
      });
      const occupancyRate = totalCapacity > 0 ? (bookedSeatsCount / totalCapacity) * 100 : 0;
      return {
        eventId: event.id,
        title: event.title,
        totalCapacity,
        bookedSeatsCount,
        occupancyRate: parseFloat(occupancyRate.toFixed(2))
      };
    });
  }
}

module.exports = new ReportRepository();
