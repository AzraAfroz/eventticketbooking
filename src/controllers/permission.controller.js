const permissionService = require('../services/permission.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class PermissionController {
  getAllPermissions = asyncHandler(async (req, res) => {
    const permissions = await permissionService.getAllPermissions();
    return successResponse(res, 200, 'Permissions fetched successfully', permissions);
  });
}

module.exports = new PermissionController();
