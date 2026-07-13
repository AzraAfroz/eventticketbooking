const { sequelize } = require('../models');

class DashboardRepository {
  async getSummaryStats() {
    return {};
  }
}

module.exports = new DashboardRepository();
