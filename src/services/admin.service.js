const adminRepository = require('../repositories/admin.repository');
const authRepository = require('../repositories/auth.repository');
const ApiError = require('../utils/ApiError');
const { Role } = require('../models');
const { hashPassword } = require('../utils/bcrypt');
const { ROLES } = require('../config/constants');

class AdminService {
  async getAdmins() {
    return await adminRepository.findAll();
  }

  async createAdmin(adminData) {
    const { name, email, password } = adminData;

    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('Email is already registered');
    }

    // Find the admin role
    const adminRole = await Role.findOne({
      where: { name: ROLES.ADMIN }
    });

    if (!adminRole) {
      throw ApiError.internal('Admin role not found');
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the admin user
    const adminUser = await adminRepository.createAdmin({
      name,
      email,
      password: hashedPassword,
      roleId: adminRole.id
    });

    // Return details excluding password
    return {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      roleId: adminUser.roleId,
      isActive: adminUser.isActive,
      createdAt: adminUser.createdAt
    };
  }
}

module.exports = new AdminService();
