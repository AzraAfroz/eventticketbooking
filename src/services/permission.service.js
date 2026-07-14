const permissionRepository = require('../repositories/permission.repository');

class PermissionService {
  async getAllPermissions() {
    return await permissionRepository.findAll();
  }
}

module.exports = new PermissionService();
