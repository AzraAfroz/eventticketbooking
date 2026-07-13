const eventRepository = require('../repositories/event.repository');
const ApiError = require('../utils/ApiError');
const { Event, Organizer, SeatCategory, Seat, sequelize } = require('../models');
const { ROLES } = require('../config/constants');

class EventService {
  async getAllEvents() {
    return await eventRepository.findAll();
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
}

module.exports = new EventService();
