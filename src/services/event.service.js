const eventRepository = require('../repositories/event.repository');
const ApiError = require('../utils/ApiError');
const { Event, SeatCategory, Seat, sequelize } = require('../models');

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

  async createEvent(eventData) {
    const { title, description, date, eventDate, venueId, organizerId, categories } = eventData;
    
    // Support both date and eventDate field names from various client requests
    const actualEventDate = eventDate || date;
    const actualOrganizerId = organizerId || 1;
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
}

module.exports = new EventService();
