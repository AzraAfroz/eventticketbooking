const { Event, Venue, Organizer, SeatCategory } = require('../models');

class EventRepository {
  async findAll() {
    return await Event.findAll({
      include: [
        { model: Venue, as: 'venue' },
        { model: Organizer, as: 'organizer' }
      ]
    });
  }

  async findById(id) {
    return await Event.findByPk(id, {
      include: [
        { model: Venue, as: 'venue' },
        { model: Organizer, as: 'organizer' },
        { model: SeatCategory, as: 'seatCategories' }
      ]
    });
  }

  async create(eventData) {
    return await Event.create(eventData);
  }
}

module.exports = new EventRepository();
