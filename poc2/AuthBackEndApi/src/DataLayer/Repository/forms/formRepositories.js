const Form = require("../../models/form");

class FormRepository {
  async create(companyName, cityName, state) {
    return Form.create({ companyName, cityName, state });
  }

  async findById(id) {
    return Form.findByPk(id);
  }

  async findAll() {
    return Form.findAll();
  }

  async update(id, updateData) {
    const form = await Form.findByPk(id);
    if (!form) {
      return null;
    }
    return form.update(updateData);
  }

  async delete(id) {
    const form = await Form.findByPk(id);
    if (!form) {
      return null;
    }
    await form.destroy();
    return form;
  }
}

module.exports = FormRepository;
