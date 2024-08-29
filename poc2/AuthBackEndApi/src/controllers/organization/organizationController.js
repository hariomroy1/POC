class OrganizationController {
  constructor(organizationService) {
    this.organizationService = organizationService;
  }

  // Create a new organization
  async createOrganization(req, res) {
    const { name, address } = req.body;

    try {
      // Attempt to create a new organization using the service
      const result = await this.organizationService.createOrganization(name, address);
      
      // Respond with success and the ID of the created organization
      res.status(201).json({
        message: "Created Organization Successfully",
        organizationId: result.organizationId,
      });
    } catch (error) {
      console.error("Error in createOrganizationController: ", error);

      // Handle specific error cases with appropriate status codes and messages
      if (error.message === "Organization Already Exist!") {
        return res.status(409).json({ message: "Organization already exists" });
      } else if (error.message === "All Fields are Required") {
        return res.status(400).json({ message: "All fields are required" });
      } else {
        // Handle general internal server error
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  // Delete an organization by ID
  async deleteOrganization(req, res) {
    const { id } = req.params;

    try {
      // Attempt to delete the organization by ID using the service
      await this.organizationService.deleteOrganizationById(id);
      
      // Respond with success message
      res.status(200).json({ message: "Organization deleted successfully" });
    } catch (error) {
      console.error("Error in deleteOrganizationController: ", error);

      // Handle specific error cases with appropriate status codes and messages
      if (error.message === "Organization not found") {
        return res.status(404).json({ message: "Organization not found" });
      } else {
        // Handle general internal server error
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  // Update an organization's details by ID
  async updateOrganization(req, res) {
    const { id } = req.params;
    const { name, address } = req.body;

    try {
      // Attempt to update the organization by ID using the service
      const result = await this.organizationService.updateOrganizationById(id, name, address);
      
      // Respond with success and the ID of the updated organization
      res.status(200).json({
        message: "Updated Organization Successfully",
        organizationId: result.organizationId,
      });
    } catch (error) {
      console.error("Error in updateOrganizationController: ", error);

      // Handle specific error cases with appropriate status codes and messages
      if (error.message === "Organization not found") {
        return res.status(404).json({ message: "Organization not found" });
      } else if (error.message === "All Fields are Required") {
        return res.status(400).json({ message: "All fields are required" });
      } else {
        // Handle general internal server error
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = OrganizationController;
