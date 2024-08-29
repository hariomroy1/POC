const Role = require("../../models/Role");

class RoleRepository {
  //find role name if already present
  async findOneByName(name) {
    return await Role.findOne({
      where: { name },
    });
  }

  //create a new role and its description
  //like admin and this is admin

  async create(name, description) {
    return await Role.create({
      name,
      description,
    });
  }

  //find fole with the help of primary key
  async findByPk(id) {
    return await Role.findByPk(id);
  }
}

module.exports = RoleRepository;
