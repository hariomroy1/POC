const formService = require('../../Services/forms/formService');

class FormController {
  constructor(formService) {
    this.formService = formService;
  }

  // Method to create a new form
  createForm = async (req, res) => {
    try {
      const { companyName, cityName, state } = req.body;
      const form = await this.formService.createForm(companyName, cityName, state);
      res.status(201).json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Method to get a form by its ID
  getFormById = async (req, res) => {
    try {
      const form = await this.formService.getFormById(req.params.id);
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Method to get all forms
  getAllForms = async (req, res) => {
    try {
      const forms = await this.formService.getAllForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Method to update a form by its ID
  updateForm = async (req, res) => {
    try {
      const form = await this.formService.updateForm(req.params.id, req.body);
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Method to delete a form by its ID
  deleteForm = async (req, res) => {
    try {
      const result = await this.formService.deleteForm(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  async submitData(req, res) {
    try {
      const response = await authService.saveSteps(req.body);
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in submitData:", error);
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FormController;
