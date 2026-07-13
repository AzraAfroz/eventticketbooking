const authRepository = require('../repositories/auth.repository');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { signToken } = require('../utils/jwt');
const { Role } = require('../models');
const { ROLES } = require('../config/constants');

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('Email is already registered');
    }

    // Find the default customer role
    const customerRole = await Role.findOne({
      where: { name: ROLES.CUSTOMER }
    });

    if (!customerRole) {
      throw ApiError.internal('Default customer role not found');
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      roleId: customerRole.id
    });

    // Retrieve user details with loaded role and permissions
    const createdUser = await authRepository.findByEmail(email);
    if (!createdUser) {
      throw ApiError.internal('Error retrieving registered user details');
    }

    const roleName = createdUser.role.name;
    const permissions = createdUser.role.permissions.map(p => p.name);

    // Generate JWT token
    const token = signToken({
      id: createdUser.id,
      email: createdUser.email,
      role: roleName,
      permissions
    });

    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: roleName,
        permissions
      },
      token
    };
  }

  async login(email, password) {
    // Retrieve user by email
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw ApiError.forbidden('Your account is deactivated. Please contact support.');
    }

    const roleName = user.role.name;
    const permissions = user.role.permissions.map(p => p.name);

    // Generate JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: roleName,
      permissions
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
        permissions
      },
      token
    };
  }
}

module.exports = new AuthService();
