const dashboardRepository = require('../repositories/dashboard.repository');

class DashboardService {
  async getDashboardSummary(user) {
    return await dashboardRepository.getSummaryStats(user);
  }
}

module.exports = new DashboardService();
