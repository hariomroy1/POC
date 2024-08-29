class OrganizationService {
  constructor(organizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  //create organizatin with name and address
  async createOrganization(name, address) {
    try {
      if (!name || !address) {
        throw new Error("All Fields are Required");
      }

      const existingOrganization =
        await this.organizationRepository.findOneByNameAndAddress(name, address);

      if (existingOrganization) {
        throw new Error("Organization Already Exist!");
      }

      const newOrganization = await this.organizationRepository.create(name, address);

      return { organizationId: newOrganization.id };
    } catch (error) {
      throw error;
    }
  }

//delete organization by id
  async deleteOrganizationById(id) {
    try {
      const organization = await this.organizationRepository.findById(id);

      if (!organization) {
        throw new Error("Organization not found");
      }

      await this.organizationRepository.delete(organization);

      return { message: "Organization deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  //update organization by altering id name and address
  async updateOrganizationById(id, name, address) {
    try {
      if (!name || !address) {
        throw new Error("All Fields are Required");
      }

      const organization = await this.organizationRepository.findById(id);

      if (!organization) {
        throw new Error("Organization not found");
      }

      organization.name = name;
      organization.address = address;

      await this.organizationRepository.update(organization);

      return { organizationId: organization.id };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrganizationService;
