const { Role, Permission } = require('../models');

class RoleRepository {
  async findAll() {
    return await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });
  }

  async findById(id) {
    return await Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });
  }

  async create(roleData) {
    return await Role.create(roleData);
  }
}

module.exports = new RoleRepository();
