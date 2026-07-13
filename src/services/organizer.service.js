const organizerRepository = require('../repositories/organizer.repository');
const ApiError = require('../utils/ApiError');

class OrganizerService {
  async getAllOrganizers() {
    return await organizerRepository.findAll();
  }

  async getOrganizerById(id) {
    const organizer = await organizerRepository.findById(id);
    if (!organizer) {
      throw ApiError.notFound('Organizer not found');
    }
    return organizer;
  }

  async createOrganizer(organizerData) {
    return await organizerRepository.create(organizerData);
  }

  async updateOrganizer(id, organizerData) {
    const organizer = await organizerRepository.findById(id);
    if (!organizer) {
      throw ApiError.notFound('Organizer not found');
    }
    await organizerRepository.update(id, organizerData);
    return await organizerRepository.findById(id);
  }

  async approveOrganizer(id) {
    const organizer = await organizerRepository.findById(id);
    if (!organizer) {
      throw ApiError.notFound('Organizer not found');
    }
    await organizerRepository.updateUserStatus(organizer.userId, true);
    return await organizerRepository.findById(id);
  }

  async suspendOrganizer(id) {
    const organizer = await organizerRepository.findById(id);
    if (!organizer) {
      throw ApiError.notFound('Organizer not found');
    }
    await organizerRepository.updateUserStatus(organizer.userId, false);
    return await organizerRepository.findById(id);
  }
}

module.exports = new OrganizerService();
