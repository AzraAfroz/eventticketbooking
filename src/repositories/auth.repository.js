const { User, Role, Permission } = require('../models');

class AuthRepository {
  async findByEmail(email) {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['name'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });
  }

  async createUser(userData) {
    return await User.create(userData);
  }
}

module.exports = new AuthRepository();
