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
    const organizerRole = await this.getOrganizerRole();
    const organizer = await organizerRepository.create(organizerData);

    await organizerRepository.updateUserRole(organizer.userId, organizerRole.id);
    return await organizerRepository.findById(organizer.id);
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
    const organizerRole = await this.getOrganizerRole();

    await organizerRepository.updateUserStatus(organizer.userId, true);
    await organizerRepository.updateUserRole(organizer.userId, organizerRole.id);
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

  async getOrganizerRole() {
    const organizerRole = await organizerRepository.findOrganizerRole();
    if (!organizerRole) {
      throw ApiError.internal('Organizer role not found');
    }
    return organizerRole;
  }
}

module.exports = new OrganizerService();
