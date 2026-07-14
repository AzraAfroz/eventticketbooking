const venueRepository = require('../repositories/venue.repository');
const ApiError = require('../utils/ApiError');

class VenueService {
  async getAllVenues() {
    return await venueRepository.findAll();
  }

  async getVenueById(id) {
    const venue = await venueRepository.findById(id);
    if (!venue) {
      throw ApiError.notFound('Venue not found');
    }
    return venue;
  }

  async createVenue(venueData) {
    return await venueRepository.create(venueData);
  }

  async updateVenue(id, venueData) {
    const venue = await venueRepository.findById(id);
    if (!venue) {
      throw ApiError.notFound('Venue not found');
    }
    return await venueRepository.update(id, venueData);
  }

  async deleteVenue(id) {
    const venue = await venueRepository.findById(id);
    if (!venue) {
      throw ApiError.notFound('Venue not found');
    }
    
    const { Event } = require('../models');
    const eventCount = await Event.count({ where: { venueId: id } });
    if (eventCount > 0) {
      throw ApiError.badRequest('Cannot delete venue as it is currently in use by scheduled events.');
    }
    
    return await venueRepository.delete(id);
  }
}

module.exports = new VenueService();
