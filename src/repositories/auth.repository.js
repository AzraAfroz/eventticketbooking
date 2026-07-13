const { User } = require('../models');

class AuthRepository {
  async findByEmail(email) {
    // Database query placeholder
    return null;
  }

  async createUser(userData) {
    // Database insert placeholder
    return null;
  }
}

module.exports = new AuthRepository();
