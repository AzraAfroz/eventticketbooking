const { Permission } = require('../models');

class PermissionRepository {
  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }
}

module.exports = new PermissionRepository();
