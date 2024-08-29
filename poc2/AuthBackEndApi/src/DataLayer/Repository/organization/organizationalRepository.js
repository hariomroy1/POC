const { Organizations } = require("../../models");

class OrganizationRepository  {
  async findOneByNameAndAddress(name, address) {
    return Organizations.findOne({ where: { name, address } });
  }

  //create organization with name and address
  async create(name, address) {
    return Organizations.create({ name, address });
  }

  //find organization by id
  async findById(id) {
    return Organizations.findByPk(id);
  }

  //delete organization by id
  async delete(org) {
    return org.destroy();
  }

  //update organization by id
  async update(org) {
    return org.save();
  }
}

module.exports =  OrganizationRepository;
