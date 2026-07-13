const { sequelize } = require('../models');

class ReportRepository {
  async getSalesReport(startDate, endDate) {
    return [];
  }
}

module.exports = new ReportRepository();
