const reportRepository = require('../repositories/report.repository');

class ReportService {
  async getSalesReport(startDate, endDate) {
    return await reportRepository.getSalesReport(startDate, endDate);
  }

  async getRevenueReport(startDate, endDate) {
    return await reportRepository.getRevenueReport(startDate, endDate);
  }

  async getOrganizerPerformance() {
    return await reportRepository.getOrganizerPerformance();
  }

  async getCustomerActivity() {
    return await reportRepository.getCustomerActivity();
  }

  async getBookingAnalytics() {
    return await reportRepository.getBookingAnalytics();
  }
}

module.exports = new ReportService();
