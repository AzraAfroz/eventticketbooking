const reportService = require('../services/report.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class ReportController {
  getSalesReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const report = await reportService.getSalesReport(startDate, endDate);
    return successResponse(res, 200, 'Sales report generated successfully', report);
  });
}

module.exports = new ReportController();
