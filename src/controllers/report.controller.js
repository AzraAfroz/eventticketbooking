const reportService = require('../services/report.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class ReportController {
  getSalesReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const report = await reportService.getSalesReport(startDate, endDate);
    return successResponse(res, 200, 'Sales report generated successfully', report);
  });

  getRevenueReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const report = await reportService.getRevenueReport(startDate, endDate);
    return successResponse(res, 200, 'Revenue report generated successfully', report);
  });

  getOrganizerPerformance = asyncHandler(async (req, res) => {
    const report = await reportService.getOrganizerPerformance();
    return successResponse(res, 200, 'Organizer performance report generated successfully', report);
  });

  getCustomerActivity = asyncHandler(async (req, res) => {
    const report = await reportService.getCustomerActivity();
    return successResponse(res, 200, 'Customer activity report generated successfully', report);
  });

  getBookingAnalytics = asyncHandler(async (req, res) => {
    const report = await reportService.getBookingAnalytics();
    return successResponse(res, 200, 'Booking analytics report generated successfully', report);
  });
}

module.exports = new ReportController();
