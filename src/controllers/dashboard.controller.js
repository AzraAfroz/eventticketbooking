const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class DashboardController {
  getSummary = asyncHandler(async (req, res) => {
    const summary = await dashboardService.getDashboardSummary(req.user);
    return successResponse(res, 200, 'Dashboard summary fetched successfully', summary);
  });
}

module.exports = new DashboardController();
