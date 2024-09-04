// services/stepSelectionService.js
const stepSelectionRepository = require('../repositories/stepSelectionRepository');

const createStepSelection = async (data) => {
  const { organizationId, userId, stepIds } = data;

  if (!organizationId || !userId || !Array.isArray(stepIds)) {
    throw new Error('Invalid data');
  }

  return stepSelectionRepository.saveStepSelection(organizationId, userId, stepIds);
};

module.exports = {
  createStepSelection,
};
