class UserController {
  constructor(UserService, authService, rolesService) {
    this.userService = UserService;
    this.authService = authService;
    this.rolesService = rolesService;
  }

  // Create signup process with the help of organization id which tells us that user belongs to that
  // particular organization ... take email, username, and password also for this process

  async createUser(req, res) {
    const { organizationId, email, username, password } = req.body;

    try {
      // Call the userService to create a new user
      const result = await this.authService.createUser(
        organizationId,
        email,
        username,
        password
      );

      // Return success response
      res.status(201).json({
        message: "Created User Successfully",
        userId: result.userId,
      });
    } catch (error) {
      console.error("Error in createUserController:", error);

      // Handle specific errors with appropriate HTTP status codes and messages
      if (
        error.message === "Username already exists" ||
        error.message === "Email already exists"
      ) {
        return res
          .status(409)
          .json({ message: "Username or email already exists" });
      } else if (error.message === "All fields are required") {
        return res.status(400).json({ message: "All fields are required" });
      } else {
        // Handle unexpected errors with a generic message
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  // Here we take email and password for login process

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const result = await this.userService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in loginController:", error);
      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        return res.status(401).json({ message: "Invalid email or password" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  // Here we verify otp with the help of email and the otp which was sent to mail

  async verifyOtp(req, res) {
    const { email, otp } = req.body;

    try {
      const result = await this.userService.verifyOtp(email, otp);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in verifyOtpController:", error);
      if (
        error.message === "Invalid or expired OTP" ||
        error.message === "OTP has expired" ||
        error.message === "Invalid OTP"
      ) {
        return res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  // This function assigns the role to user on the basis of userId and roleId,
  // User id tells me the identity of user and details
  // role id specifies the position of that person in an organization

  async createUserRole(req, res) {
    const { userId, roleId } = req.body;

    try {
      const result = await this.rolesService.createUserRole(userId, roleId);
      res.status(201).json({
        message: "Created UserRole Successfully",
        userRoleId: result.userRoleId,
      });
    } catch (error) {
      console.error("Error in createUserRoleController:", error);
      if (error.message === "User Not Found") {
        return res.status(404).json({ message: "User Not Found" });
      } else if (error.message === "Role Not Found") {
        return res.status(404).json({ message: "Role Not Found" });
      } else if (error.message === "UserRole Already Exists!") {
        return res.status(409).json({ message: "UserRole Already Exists!" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = UserController;
