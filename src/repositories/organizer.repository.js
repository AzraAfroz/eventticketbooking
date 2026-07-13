const { Organizer, User } = require('../models');

class OrganizerRepository {
  async findAll() {
    return await Organizer.findAll({
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });
  }

  async findById(id) {
    return await Organizer.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });
  }

  async create(organizerData) {
    return await Organizer.create(organizerData);
  }

  async update(id, organizerData) {
    const organizer = await Organizer.findByPk(id);
    if (organizer) {
      await organizer.update(organizerData);
    }
    return organizer;
  }

  async updateUserStatus(userId, isActive) {
    const user = await User.findByPk(userId);
    if (user) {
      user.isActive = isActive;
      await user.save();
    }
    return user;
  }
}

module.exports = new OrganizerRepository();
