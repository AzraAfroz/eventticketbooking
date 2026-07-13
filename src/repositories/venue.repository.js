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
}

module.exports = new VenueRepository();
