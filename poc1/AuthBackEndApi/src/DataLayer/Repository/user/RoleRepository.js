const { Role, userRoles,User } = require('../../../DataLayer/models');

class RolesRepository {
  //find role by id
  async findRoleById(id) {
    return Role.findByPk(id);
  }
//find user role with the help of userId and roleId
  async findUserRole(userId, roleId) {
    return userRoles.findOne({ where: { userId, roleId } });
  }

  //create a user role with userid and roleid
  async createUserRole(userId, roleId) {
    return userRoles.create({ userId, roleId });
  }
  //find user by id
  async findUserById(userId)
  {
    const user = await User.findOne({ where: { id: userId } });

    return user;
  }
}

module.exports = RolesRepository;
