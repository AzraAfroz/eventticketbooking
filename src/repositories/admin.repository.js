const { User } = require('../models');

class AdminRepository {
  async findAll() {
    return [];
  }

  async createAdmin(adminData) {
    return null;
  }
}

module.exports = new AdminRepository();
