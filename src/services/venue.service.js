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
}

module.exports = new VenueService();
