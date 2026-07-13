const roleService = require('../services/role.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class RoleController {
  getAllRoles = asyncHandler(async (req, res) => {
    const roles = await roleService.getAllRoles();
    return successResponse(res, 200, 'Roles fetched successfully', roles);
  });

  getRoleById = asyncHandler(async (req, res) => {
    const role = await roleService.getRoleById(req.params.id);
    return successResponse(res, 200, 'Role fetched successfully', role);
  });

  createRole = asyncHandler(async (req, res) => {
    const role = await roleService.createRole(req.body);
    return successResponse(res, 201, 'Role created successfully', role);
  });
}

module.exports = new RoleController();
