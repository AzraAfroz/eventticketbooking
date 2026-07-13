const adminService = require('../services/admin.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class AdminController {
  getAdmins = asyncHandler(async (req, res) => {
    const admins = await adminService.getAdmins();
    return successResponse(res, 200, 'Admins fetched successfully', admins);
  });

  createAdmin = asyncHandler(async (req, res) => {
    const admin = await adminService.createAdmin(req.body);
    return successResponse(res, 201, 'Admin created successfully', admin);
  });
}

module.exports = new AdminController();
