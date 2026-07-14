const { Permission } = require('../models');

class PermissionRepository {
  async findAll() {
    return await Permission.findAll();
  }

  async findById(id) {
    return await Permission.findByPk(id);
  }
}

module.exports = new PermissionRepository();
