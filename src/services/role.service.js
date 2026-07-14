const roleRepository = require('../repositories/role.repository');
const ApiError = require('../utils/ApiError');
const { Role } = require('../models');

class RoleService {
  async getAllRoles() {
    return await roleRepository.findAll();
  }

  async getRoleById(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw ApiError.notFound('Role not found');
    }
    return role;
  }

  async createRole(roleData) {
    const { name } = roleData;
    if (!name) {
      throw ApiError.badRequest('Role name is required');
    }
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      throw ApiError.conflict('Role name already exists');
    }
    return await roleRepository.create(roleData);
  }
}

module.exports = new RoleService();
