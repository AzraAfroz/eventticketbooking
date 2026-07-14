const eventRepository = require('../repositories/event.repository');
const ApiError = require('../utils/ApiError');
const { Event, Organizer, SeatCategory, Seat, Booking, Ticket, sequelize } = require('../models');
const { ROLES, BOOKING_STATUS, TICKET_STATUS, SEAT_STATUS } = require('../config/constants');

class EventService {
  async getAllEvents(queryParams = {}) {
    const { city, category, date } = queryParams;
    const where = {};
    const venueWhere = {};
    const categoryWhere = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      
      const { Op } = require('sequelize');
      where.eventDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (city) {
      const { Op } = require('sequelize');
      venueWhere.city = {
        [Op.iLike]: `%${city}%`
      };
    }

    if (category) {
      const { Op } = require('sequelize');
      categoryWhere.name = {
        [Op.iLike]: `%${category}%`
      };
    }

    const { Venue, Organizer, SeatCategory } = require('../models');
    
    return await Event.findAll({
      where,
      include: [
        { 
          model: Venue, 
          as: 'venue',
          where: Object.keys(venueWhere).length > 0 ? venueWhere : undefined
        },
        { model: Organizer, as: 'organizer' },
        {
          model: SeatCategory,
          as: 'seatCategories',
          where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined,
          required: Object.keys(categoryWhere).length > 0 ? true : false
        }
      ]
    });
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }
    return event;
  }

  async createEvent(eventData, currentUser) {
    const { title, description, date, eventDate, venueId, organizerId, categories } = eventData;
    
    // Support both date and eventDate field names from various client requests
    const actualEventDate = eventDate || date;
    const actualOrganizerId = await this.resolveOrganizerId(currentUser, organizerId);
    const actualCategories = categories || [{ name: 'General Admission', price: 50.00, capacity: 50 }];

    const transaction = await sequelize.transaction();

    try {
      const event = await Event.create({
        title,
        description,
        eventDate: actualEventDate,
        venueId,
        organizerId: actualOrganizerId
      }, { transaction });

      if (actualCategories && actualCategories.length > 0) {
        for (const cat of actualCategories) {
          const seatCategory = await SeatCategory.create({
            eventId: event.id,
            name: cat.name,
            price: cat.price,
            capacity: cat.capacity
          }, { transaction });

          // Generate seats for the category
          const seatsToCreate = [];
          for (let i = 1; i <= cat.capacity; i++) {
            seatsToCreate.push({
              seatCategoryId: seatCategory.id,
              seatNumber: `${cat.name.substring(0, 3).toUpperCase()}-${i}`,
              status: 'available'
            });
          }
          await Seat.bulkCreate(seatsToCreate, { transaction });
        }
      }

      await transaction.commit();

      // Return the complete created event details with loaded associations
      return await eventRepository.findById(event.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async resolveOrganizerId(currentUser, organizerId) {
    if (currentUser?.role === ROLES.ORGANIZER) {
      const organizer = await Organizer.findOne({ where: { userId: currentUser.id } });
      if (!organizer) {
        throw ApiError.forbidden('Organizer profile not found for this user');
      }
      return organizer.id;
    }

    if (!organizerId) {
      throw ApiError.badRequest('organizerId is required');
    }

    return organizerId;
  }

  async updateEvent(id, updateData, currentUser) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    if (currentUser.role === ROLES.ORGANIZER) {
      const organizer = await Organizer.findOne({ where: { userId: currentUser.id } });
      if (!organizer || event.organizerId !== organizer.id) {
        throw ApiError.forbidden('You do not have permission to modify this event');
      }
    }

    const { title, description, date, eventDate, venueId, organizerId } = updateData;
    const actualEventDate = eventDate || date;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (actualEventDate !== undefined) event.eventDate = actualEventDate;
    if (venueId !== undefined) event.venueId = venueId;
    if (organizerId !== undefined && currentUser.role !== ROLES.ORGANIZER) {
      event.organizerId = organizerId;
    }

    await event.save();
    return await eventRepository.findById(event.id);
  }

  async cancelEvent(id, currentUser) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    if (currentUser.role === ROLES.ORGANIZER) {
      const organizer = await Organizer.findOne({ where: { userId: currentUser.id } });
      if (!organizer || event.organizerId !== organizer.id) {
        throw ApiError.forbidden('You do not have permission to cancel this event');
      }
    }

    const transaction = await sequelize.transaction();

    try {
      event.status = 'cancelled';
      await event.save({ transaction });

      const bookings = await Booking.findAll({ where: { eventId: event.id } });
      const bookingIds = bookings.map(b => b.id);

      if (bookingIds.length > 0) {
        await Booking.update(
          { status: BOOKING_STATUS.CANCELLED },
          { where: { id: bookingIds }, transaction }
        );

        await Ticket.update(
          { status: TICKET_STATUS.CANCELLED },
          { where: { bookingId: bookingIds }, transaction }
        );
      }

      const seatCategories = await SeatCategory.findAll({ where: { eventId: event.id } });
      const seatCategoryIds = seatCategories.map(sc => sc.id);

      if (seatCategoryIds.length > 0) {
        await Seat.update(
          { status: SEAT_STATUS.AVAILABLE },
          { where: { seatCategoryId: seatCategoryIds }, transaction }
        );
      }

      await transaction.commit();
      return await eventRepository.findById(event.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new EventService();
