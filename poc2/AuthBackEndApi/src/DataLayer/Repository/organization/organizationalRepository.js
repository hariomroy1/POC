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

  //want to get all organization list
  //this in wrong databasae repo
  async getAllOrganizationList(req, res) {
    try {
      // Fetch all records from the Organization table
      const organizations = await Organizations.findAll();
    
      // Respond with the list of organizations
      res.status(200).json(organizations);
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
    }
  }

  async getAll() {
    try {
      // Fetch all records and select both `id` and `name` fields
      const organizations = await Organizations.findAll({
        attributes: ['id', 'name']
      });
  
      // Return an array of objects with `id` and `name`
      return organizations.map(org => ({
        id: org.id,
        name: org.name
      }));
    } catch (error) {
      throw new Error('Error fetching organizations: ' + error.message);
    }
  }
  
  
}

module.exports =  OrganizationRepository;
