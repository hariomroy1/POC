class stepService {
  constructor(stepRepository) {
    this.stepRepository = stepRepository;
  }

  async createStep(stepName) {
    if (!stepName) {
      throw new Error("All fields are required");
    }
    return this.stepRepository.create(stepName);
  }

   getUserNameByOrgId = async (orgId) => {
    return await stepRepository.getUserNameByOrgId(orgId);
  };

  //for auth
  async saveSteps(data) {
    const { organization, user, steps } = data;
       
    if (!organization || !user || !steps || !steps.length) {
      throw new Error("Invalid input data");
    }

    return await this.stepRepository.createSteps(organization, user, steps);
  }
}
