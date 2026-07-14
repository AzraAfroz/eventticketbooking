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
    const { userId } = organizerData;
    const { User } = require('../models');
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Check if organizer profile already exists for this user
    const existingOrganizer = await organizerRepository.findByUserId(userId);
    if (existingOrganizer) {
      throw ApiError.conflict('Organizer profile already exists for this user');
    }

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

  async rejectOrganizer(id) {
    const organizer = await organizerRepository.findById(id);
    if (!organizer) {
      throw ApiError.notFound('Organizer not found');
    }
    const { Role, Organizer } = require('../models');
    const { ROLES } = require('../config/constants');
    const customerRole = await Role.findOne({ where: { name: ROLES.CUSTOMER } });
    
    if (customerRole) {
      await organizerRepository.updateUserRole(organizer.userId, customerRole.id);
    }
    await organizerRepository.updateUserStatus(organizer.userId, false);
    
    const orgRecord = await Organizer.findByPk(id);
    if (orgRecord) {
      await orgRecord.destroy();
    }
    
    return {
      message: 'Organizer application has been rejected and the profile was removed.'
    };
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
