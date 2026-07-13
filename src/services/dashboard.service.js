const dashboardRepository = require('../repositories/dashboard.repository');

class DashboardService {
  async getDashboardSummary() {
    return await dashboardRepository.getSummaryStats();
  }
}

module.exports = new DashboardService();
