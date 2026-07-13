const reportRepository = require('../repositories/report.repository');

class ReportService {
  async getSalesReport(startDate, endDate) {
    return await reportRepository.getSalesReport(startDate, endDate);
  }
}

module.exports = new ReportService();
