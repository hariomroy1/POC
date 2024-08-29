class RoleController {
  constructor(roleService) {
    this.roleService = roleService;
  }

  // Create a new role
  async createRole(req, res) {
    const { name, description } = req.body;

    try {
      // Attempt to create a new role using the service
      const result = await this.roleService.createRole(name, description);
      
      // Respond with success and the ID of the created role
      res.status(201).json({
        message: "Created Role Successfully",
        roleId: result.roleId,
      });
    } catch (error) {
      console.error("Error in createRoleController: ", error);

      // Handle specific error cases with appropriate status codes and messages
      if (error.message === "Role Already Exists!") {
        return res.status(409).json({ message: "Role already exists" });
      } else if (error.message === "All Fields are Required") {
        return res.status(400).json({ message: "All fields are required" });
      } else {
        // Handle general internal server error
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = RoleController;
