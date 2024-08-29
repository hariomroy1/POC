const bcrypt = require('bcrypt');
const { User } = require('../../DataLayer/models');

class UserService {
  async createUser(organizationId, email, username, password) {
    try {
      // Check if all required fields are provided
      if (!organizationId || !email || !username || !password) {
        throw new Error('All fields are required');
      }

      // Check if the email is already in use
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        throw new Error('Email already exists');
      }

      // Check if the username is already in use
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        throw new Error('Username already exists');
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the new user
      const newUser = await User.create({
        organizationId,
        email,
        username,
        passwordHash: hashedPassword,
      });

      return { userId: newUser.id };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

}

module.exports = UserService;


