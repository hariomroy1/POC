const stepRepository = require('../../DataLayer/Repository/forms/stepRepository'); // Ensure this path is correct
const stepSelectionService = require('../../Services/forms/stepService');

class StepController {
  constructor() {}

  // Logic for creating a step directly in the controller
  createStep = async (req, res) => {
    try {
      console.log('Request Body:', req.body); // Debug: log request body
      const { orgId, userId, stepName } = req.body;
  
      const step = await stepRepository.create(orgId, userId, stepName);
      res.status(201).json(step);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  };
  
  //fetch steps by orgId
  getStepsByOrgId = async (req, res) => {
    try {
      const orgId = req.params.id;

      // Fetch steps from the repository
      const steps = await stepRepository.getStepsByOrgId(orgId);

      // Extract only the stepName from each step and return as an array
      const stepNames = steps.map(step => step.stepName);

      // Return the step names as JSON
      res.status(200).json(stepNames);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

 getUserIdByOrgId = async (req, res) => {
  try {
    const  orgId  = req.params.id;
    const userId = await stepRepository.getUserIdByOrgId(orgId);
    res.status(200).json({ userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 getUserNameByOrgId = async (req, res) => {
  try {
    const orgId = req.params.id;
    const userName = await stepRepository.getUserNameByOrgId(orgId);
    res.status(200).json({ userName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//for authorization controller
 submitData = async (req, res) => {
  try {
    const { orgId, username, steps } = req.body;

    if (!orgId || !username || !steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const result = await stepRepository.createSteps(orgId, username, steps);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in submitData controller:', error);
    res.status(400).json({ error: error.message });
  }
};

//get assinged steps name with username
async getStepsByUsername(req, res) {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).send({ message: "Username is required" });
    }

    // Call the repository method to fetch the steps
    const steps = await stepRepository.getStepsByUsername(username);
    console.log(steps)

    if (!steps || steps.length === 0) {
      return res.status(404).send({ message: "No steps found for the given username" });
    }

    return res.status(200).send({ steps });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}
}

module.exports = new StepController();
