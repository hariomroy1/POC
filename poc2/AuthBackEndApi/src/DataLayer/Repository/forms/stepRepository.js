const Step = require("../../models/step"); 
const User = require("../../models/User");
const Auth = require("../../models/Auth");

class StepRepository {
  async create(orgId,userId,stepName) {
    return Step.create({ orgId,userId,stepName }); 
  }
  async getStepsByOrgId(orgId) {
    return Step.findAll({
      where: { orgId },
    });
  }

  async getUserNameByOrgId(orgId) {
    try {
      // Fetch the step record where orgId matches and include the userId
      const step = await Step.findOne({
        where: { orgId },
        attributes: ['userId'], // Select only the userId field
      });

      if (!step) {
        throw new Error('Step not found for the given organization ID');
      }

      const userId = step.userId;

      // Fetch the user record where userId matches
      const user = await User.findOne({
        where: { id: userId },
        attributes: ['username'], // Select only the name field
      });

      if (!user) {
        throw new Error('User not found for the given user ID');
      }

      return user.username;
    } catch (error) {
      throw new Error('Error fetching userName by organization ID: ' + error.message);
    }
  }


  //for authorization
  async createSteps(orgId, username, steps) {
    try {
      // Find the user by username
      const user = await User.findOne({ where: { username } });

      if (!user) {
        throw new Error("User not found");
      }

      const userId = user.id;

      // Create multiple entries for each step
      const stepPromises = steps.map((step) =>
        Auth.create({
          orgId: orgId,
          username: username,  // Or use userId if username isn't necessary
          stepName: step,
        })
      );

      await Promise.all(stepPromises);
      return { message: "Steps successfully saved!" };
    } catch (error) {
      console.error("Error in createSteps:", error);
      throw error;
    }
  }
  

  //get steps name with username
  async getStepsByUsername(username) {
    try {
      // Find all Auth records where the username matches and return only the stepName column
      const steps = await Auth.findAll({
        where: { username },
        attributes: ['stepName'], // Only fetch the stepName column
      });
  
      // Map the result to return an array of step names
      const stepNames = steps.map(step => step.stepName);
      return stepNames; // Return a simple array of step names
    } catch (error) {
      throw error;
    }
  }
  
}


module.exports = new StepRepository(); 
