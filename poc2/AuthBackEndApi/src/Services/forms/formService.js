class FormService {
    constructor(formRepository) {
      this.formRepository = formRepository;
    }
  
    async createForm(companyName, cityName, state) {
      if (!companyName || !cityName || !state) {
        throw new Error("All fields are required");
      }
      return this.formRepository.create(companyName, cityName, state);
    }
  
    async getFormById(id) {
      const form = await this.formRepository.findById(id);
      if (!form) {
        throw new Error("Form not found");
      }
      return form;
    }
  
    async getAllForms() {
      return this.formRepository.findAll();
    }
  
    async updateForm(id, formData) {
      const form = await this.formRepository.update(id, formData);
      if (!form) {
        throw new Error("Form not found");
      }
      return form;
    }
  
    async deleteForm(id) {
      const form = await this.formRepository.delete(id);
      if (!form) {
        throw new Error("Form not found");
      }
      return { message: "Form deleted successfully" };
    }
  }
  
  module.exports = FormService;
  