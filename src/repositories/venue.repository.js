const { Venue } = require('../models');

class VenueRepository {
  async findAll() {
    return await Venue.findAll();
  }

  async findById(id) {
    return await Venue.findByPk(id);
  }

  async create(venueData) {
    return await Venue.create(venueData);
  }

  async update(id, venueData) {
    const venue = await Venue.findByPk(id);
    if (venue) {
      await venue.update(venueData);
    }
    return venue;
  }

  async delete(id) {
    const venue = await Venue.findByPk(id);
    if (venue) {
      await venue.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new VenueRepository();
