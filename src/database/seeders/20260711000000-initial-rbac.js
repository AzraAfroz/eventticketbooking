'use strict';

const { ROLES } = require('../../config/constants');
const { PERMISSIONS, ROLE_PERMISSIONS_MAPPING } = require('../../config/permissions');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

  
    const rolesData = Object.values(ROLES).map(role => ({
      name: role,
      description: `Role for ${role.replace('_', ' ')}`,
      created_at: now,
      updated_at: now
    }));
    await queryInterface.bulkInsert('roles', rolesData);

    // Fetch inserted roles to map name to ID
    const [roles] = await queryInterface.sequelize.query('SELECT id, name from roles;');
    const roleMap = {};
    roles.forEach(row => {
      roleMap[row.name] = row.id;
    });

    // 2. Seed Permissions
    const permissionsData = Object.values(PERMISSIONS).map(permission => ({
      name: permission,
      description: `Permission to ${permission.replace(/_/g, ' ')}`,
      created_at: now,
      updated_at: now
    }));
    await queryInterface.bulkInsert('permissions', permissionsData);

 
    const [permissions] = await queryInterface.sequelize.query('SELECT id, name from permissions;');
    const permissionMap = {};
    permissions.forEach(row => {
      permissionMap[row.name] = row.id;
    });

    
    const rolePermissionsData = [];
    Object.keys(ROLE_PERMISSIONS_MAPPING).forEach(roleName => {
      const roleId = roleMap[roleName];
      const permissionNames = ROLE_PERMISSIONS_MAPPING[roleName];
      permissionNames.forEach(permName => {
        const permissionId = permissionMap[permName];
        if (roleId && permissionId) {
          rolePermissionsData.push({
            role_id: roleId,
            permission_id: permissionId,
            created_at: now,
            updated_at: now
          });
        }
      });
    });

    await queryInterface.bulkInsert('role_permissions', rolePermissionsData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
