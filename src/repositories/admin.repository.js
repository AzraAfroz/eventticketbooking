const { User, Role } = require('../models');
const { Op } = require('sequelize');

class AdminRepository {
  async findAll() {
    return await User.findAll({
      include: [{
        model: Role,
        as: 'role',
        where: {
          name: {
            [Op.in]: ['admin', 'super_admin']
          }
        }
      }],
      attributes: { exclude: ['password'] }
    });
  }

  async createAdmin(adminData) {
    return await User.create(adminData);
  }
}

module.exports = new AdminRepository();
