class RolesService {
  constructor(rolesRepository) {
    this.rolesRepository = rolesRepository;
  }

  //create user role with the help of userid and roleid
  async createUserRole(userId, roleId) {
    //first check is it already present or not
    const user = await this.rolesRepository.findUserById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }

    //check role is present or not
    const role = await this.rolesRepository.findRoleById(roleId);
    if (!role) {
      throw new Error("Role Not Found");
    }
    //check if particular role is already exist
    const existingUserRole = await this.rolesRepository.findUserRole(
      userId,
      roleId
    );
    if (existingUserRole) {
      throw new Error("UserRole Already Exists!");
    }
    //create a new role
    const newUserRole = await this.rolesRepository.createUserRole(
      userId,
      roleId
    );
    return { userRoleId: newUserRole.id };
  }
}

module.exports = RolesService;
